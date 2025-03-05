import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MembersFiltersDto } from './dto/members-filters';
import { WorkspacesFiltersDto } from './dto/workspaces-filters';
import { TimeEntryEntity } from 'src/timeEntries/entities/time-entry.entity';
import { ProjectsFiltersDto } from './dto/projects-filters';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async employeeOverviewReport(id: number) {
    const projects = await this.prisma.project.findMany({
      where: { members: { some: { userId: id } } },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const timeEntries = await this.prisma.timeEntry.findMany({
      where: { projectUser: { userId: id } },
      orderBy: {
        startTime: 'desc',
      },
      select: {
        id: true,
        projectUser: { select: { projectId: true } },
        startTime: true,
        endTime: true,
        description: true,
      },
    });

    const totalTime = this.calculateTotalTime(timeEntries);

    const lastWeekEntries = timeEntries.filter((entry) => {
      const entryDate = moment(entry.startTime);
      return entryDate.isAfter(moment().subtract(7, 'days'));
    });
    const totalTimeLastWeek = this.calculateTotalTime(lastWeekEntries);

    const lastMonthEntries = timeEntries.filter((entry) => {
      const entryDate = moment(entry.startTime);
      return entryDate.isAfter(moment().subtract(1, 'month'));
    });
    const totalTimeLastMonth = this.calculateTotalTime(lastMonthEntries);

    const totalTimePerProject = projects.map((project) => {
      const projectEntries = timeEntries.filter(
        (entry) => entry.projectUser.projectId === project.id,
      );
      const projectTotalTime = this.calculateTotalTime(projectEntries);
      return {
        projectId: project.id,
        projectName: project.name,
        totalTime: projectTotalTime,
        entryCount: projectEntries.length,
      };
    });

    const _timeEntries = timeEntries.map((entry) => {
      const totalTime = this.calculateTotalTime([entry]);

      return {
        ...entry,
        totalTime,
      };
    });

    const totalEntriesCount = timeEntries.length;
    const totalProjects = projects.length;

    return {
      projects: projects,
      timeEntries: _timeEntries,
      totalTime: totalTime,
      totalTimeLastWeek,
      totalTimeLastMonth,
      totalTimePerProject,
      totalEntriesCount,
      totalProjects,
    };
  }

  async workspacesSummary(filters: WorkspacesFiltersDto, userId: number) {
    const workspaces = await this.getWorkspaces(filters, userId);
    const projects = workspaces.map((workspace) => workspace.projects).flat(1);
    const members = projects.map((project) => project.members).flat(1);

    return {
      workspaces,
      projects,
      members,
    };
  }

  async projectsSummary(filters: ProjectsFiltersDto, userId: number) {
    const projects = await this.getProjects(filters, userId);
    const members = projects.map((project) => project.members).flat(1);

    return { projects, members };
  }

  async employeeProjectSummary(filters: ProjectsFiltersDto, userId: number) {
    const projects = await this.getEmployeeProjects(filters, userId);
    const timeEntries = projects.map((project) => project.timeEntries).flat(1);

    return {
      projects,
      timeEntries,
    };
  }

  async membersSummary(filters: MembersFiltersDto, userId: number) {
    const members = await this.getMembers(filters, userId);
    const timeEntries = members.map((member) => member.timeEntries).flat(1);

    const mappedTimeEntries = timeEntries.map((timeEntry) => {
      // @ts-expect-error this entry has more properties
      const totalTime = this.calculateTotalTime([timeEntry]);

      return {
        ...timeEntry,
        totalTime,
      };
    });

    return {
      members,
      timeEntries: mappedTimeEntries,
    };
  }

  async getWorkspaces(filters: WorkspacesFiltersDto, userId: number) {
    const hasDateFilters = filters.startDate && filters.endDate;
    const timeEntryFilter = hasDateFilters
      ? this.createTimeEntryFilter(filters)
      : undefined;

    const workspaces = await this.prisma.workspace.findMany({
      where: {
        created_by: userId,
        id: { in: filters.workspaceId },
      },
      select: {
        id: true,
        name: true,
        projects: {
          where: hasDateFilters
            ? { members: { some: { time_entries: { some: timeEntryFilter } } } }
            : undefined,
          select: {
            id: true,
            name: true,
            admin: {
              select: {
                id: true,
                email: true,
              },
            },
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
            members: {
              select: {
                project: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                id: true,
                user: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                  },
                },
                time_entries: {
                  where: {
                    ...(hasDateFilters ? timeEntryFilter : undefined),
                    endTime: { not: null },
                  },
                },
              },
            },
          },
        },
      },
    });

    const mappedWorkspaces = workspaces.map((workspace) => {
      const mappedProjects = workspace.projects.map((project) => {
        const mappedMembers = project.members.map((member) => {
          const totalTime = this.calculateTotalTime(member.time_entries);

          return {
            id: member.id,
            user: member.user,
            project: member.project,
            totalTime,
          };
        });

        const projectTotalTimeMs = mappedMembers.reduce((acc, member) => {
          return acc + this.parseTotalTime(member.totalTime);
        }, 0);

        return {
          ...project,
          members: mappedMembers,
          totalTime: this.formatMillisecondsToTime(projectTotalTimeMs),
        };
      });

      const workspaceTotalTimeMs = mappedProjects.reduce((acc, project) => {
        return acc + this.parseTotalTime(project.totalTime);
      }, 0);

      return {
        ...workspace,
        projects: mappedProjects,
        totalTime: this.formatMillisecondsToTime(workspaceTotalTimeMs),
      };
    });

    return mappedWorkspaces;
  }

  async getProjects(filters: ProjectsFiltersDto, userId: number) {
    const hasDateFilters = filters.startDate && filters.endDate;
    const timeEntryFilter = hasDateFilters
      ? this.createTimeEntryFilter(filters)
      : undefined;

    const projects = await this.prisma.project.findMany({
      where: {
        createdBy: userId,
        id: { in: filters.projectId },
      },
      select: {
        id: true,
        name: true,
        admin: {
          select: {
            id: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
            id: true,
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            time_entries: {
              where: {
                ...(hasDateFilters ? timeEntryFilter : undefined),
                endTime: { not: null },
              },
            },
          },
        },
      },
    });

    const mappedProjects = projects.map((project) => {
      const mappedMembers = project.members.map((member) => {
        const totalTime = this.calculateTotalTime(member.time_entries);

        return {
          id: member.id,
          user: member.user,
          project: member.project,
          totalTime,
        };
      });

      const projectTotalTimeMs = mappedMembers.reduce((acc, member) => {
        return acc + this.parseTotalTime(member.totalTime);
      }, 0);

      return {
        ...project,
        members: mappedMembers,
        totalTime: this.formatMillisecondsToTime(projectTotalTimeMs),
      };
    });

    return mappedProjects;
  }

  async getEmployeeProjects(filters: ProjectsFiltersDto, userId: number) {
    const hasDateFilters = filters.startDate && filters.endDate;
    const timeEntryFilter = hasDateFilters
      ? this.createTimeEntryFilter(filters)
      : undefined;

    const projects = await this.prisma.project.findMany({
      where: {
        id: { in: filters.projectId },
      },
      select: {
        id: true,
        name: true,
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          where: { userId },
          select: {
            time_entries: {
              include: {
                projectUser: { include: { project: true } },
              },
              where: {
                ...(hasDateFilters ? timeEntryFilter : undefined),
                endTime: { not: null },
              },
            },
          },
        },
      },
    });

    const mappedProjects = projects.map((project) => {
      const flattedTimeEntries = project.members
        .map((member) => member.time_entries)
        .flat(1);

      const mappedTimeEntries = flattedTimeEntries.map((timeEntry) => {
        // @ts-expect-error type is wrong
        const totalTime = this.calculateTotalTime([timeEntry]);

        return { ...timeEntry, totalTime };
      });
      // @ts-expect-error type is wrong
      const totalTime = this.calculateTotalTime(mappedTimeEntries);

      return {
        ...project,
        timeEntries: mappedTimeEntries,
        totalTime,
      };
    });

    return mappedProjects;
  }

  async getMembers(filters: MembersFiltersDto, userId: number) {
    const hasDateFilters = filters.startDate && filters.endDate;
    const timeEntryFilter = hasDateFilters
      ? this.createTimeEntryFilter(filters)
      : undefined;

    const members = await this.prisma.projectUser.findMany({
      where: {
        userId: { in: filters.memberId },
        project: { createdBy: userId },
      },
      select: {
        project: {
          select: {
            id: true,
            name: true,
            createdBy: true,
          },
        },
        id: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        time_entries: {
          include: {
            projectUser: {
              include: {
                project: true,
                user: true,
              },
            },
          },
          where: {
            ...(hasDateFilters ? timeEntryFilter : undefined),
            endTime: { not: null },
          },
        },
      },
    });

    const mappedMembers = members.map((member) => {
      const totalTime = this.calculateTotalTime(member.time_entries as any);

      return {
        id: member.id,
        user: member.user,
        project: member.project,
        timeEntries: member.time_entries,
        totalTime,
      };
    });

    return mappedMembers;
  }

  private createTimeEntryFilter(filters: { startDate: Date; endDate: Date }) {
    return {
      AND: [
        {
          endTime: {
            not: null,
          },
        },
        {
          OR: [
            {
              startTime: {
                gte: filters.startDate
                  ? new Date(filters.startDate)
                  : undefined,
                lte: filters.endDate ? new Date(filters.endDate) : undefined,
              },
            },
            {
              endTime: {
                gte: filters.startDate
                  ? new Date(filters.startDate)
                  : undefined,
                lte: filters.endDate ? new Date(filters.endDate) : undefined,
              },
            },
          ],
        },
      ],
    };
  }

  private calculateTotalTime(timeEntries: Partial<TimeEntryEntity>[]) {
    const totalTime = timeEntries.reduce((acc, entry) => {
      const start = moment(entry.startTime);
      const end = moment(entry.endTime);
      return acc + end.diff(start, 'milliseconds'); // Sum in milliseconds
    }, 0);

    const duration = moment.duration(totalTime);
    const hours = Math.floor(duration.asHours()); // Total hours
    const minutes = duration.minutes(); // Remaining minutes

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedTime;
  }

  private parseTotalTime(totalTime: string): number {
    if (!totalTime) return 0;
    const [hours, minutes] = totalTime.split(':').map(Number);
    return (hours * 60 + minutes) * 60 * 1000;
  }

  private formatMillisecondsToTime(ms: number): string {
    const duration = moment.duration(ms);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
