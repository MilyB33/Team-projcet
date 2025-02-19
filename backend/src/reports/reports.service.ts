import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { SummaryFiltersDto } from './dto/summary-filters.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersSummaryFiltersDto } from './dto/users-summary-filters';
import { WorkspacesFiltersDto } from './dto/workspaces-filters';
import { TimeEntryEntity } from 'src/timeEntries/entities/time-entry.entity';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async workspacesSummary(filters: WorkspacesFiltersDto, userId: number) {
    const workspaces = await this.getWorkspaces(filters, userId);
    const members = await this.getMembers(filters, userId);
    const projects = await this.getProjects(filters);

    return {
      workspaces,
      projects,
      members,
    };
  }

  async projectsSummary(filters: SummaryFiltersDto) {
    const projects = await this.findProjects(filters);

    const timeEntries = projects.map((project) => project.time_entries).flat();

    const totalTime = this.calculateTotalTime(timeEntries);

    const totalMembers = projects.reduce((acc, project) => {
      project.members.forEach((member) => {
        if (!acc.includes(member.id)) {
          acc.push(member.id);
        }
      });
      return acc;
    }, []).length;

    const totalTasks = projects.reduce(
      (acc, project) => acc + project.time_entries.length,
      0,
    );

    return {
      projects,
      totalTime,
      totalMembers,
      totalTasks,
    };
  }

  async usersSummary(filters: UsersSummaryFiltersDto) {
    return this.prisma.user.findMany({
      where: {
        id: filters.userId,
      },
      include: {
        projects: { where: { id: filters.projectId } },
        time_entries: { where: this.createTimeEntryFilter(filters) },
      },
    });
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
            ? { time_entries: { some: timeEntryFilter } }
            : undefined,
          select: {
            time_entries: {
              where: {
                ...(hasDateFilters ? timeEntryFilter : undefined),
                endTime: { not: null },
              },
            },
          },
        },
        _count: {
          select: {
            projects: {
              where: hasDateFilters
                ? { time_entries: { some: timeEntryFilter } }
                : undefined,
            },
          },
        },
      },
    });

    const mappedWorkspaces = workspaces.map((workspace) => {
      const timeEntries = workspace.projects
        .map((project) => project.time_entries)
        .flat();

      const totalTime = this.calculateTotalTime(timeEntries);

      return {
        id: workspace.id,
        name: workspace.name,
        projects: workspace.projects,
        totalTime,
      };
    });

    return mappedWorkspaces;
  }

  async getMembers(filters: WorkspacesFiltersDto, userId: number) {
    const hasDateFilters = filters.startDate && filters.endDate;
    const timeEntryFilter = hasDateFilters
      ? this.createTimeEntryFilter(filters)
      : undefined;

    const members = await this.prisma.projectUser.findMany({
      where: {
        project: {
          workspaceId: { in: filters.workspaceId },
          createdBy: userId,
        },
      },
      select: {
        id: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            time_entries: {
              where: { ...timeEntryFilter, endTime: { not: null } },
            },
          },
        },
      },
    });
    const mappedMembers = members.map((member) => {
      const timeEntries = member.user.time_entries;

      const totalTime = this.calculateTotalTime(timeEntries);

      return {
        ...member,
        totalTime,
      };
    });

    return mappedMembers;
  }

  async getProjects(filters: WorkspacesFiltersDto) {
    const hasDateFilters = filters.startDate && filters.endDate;
    const timeEntryFilter = hasDateFilters
      ? this.createTimeEntryFilter(filters)
      : undefined;

    const projects = await this.prisma.project.findMany({
      where: {
        workspaceId: { in: filters.workspaceId },
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
        admin: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        time_entries: { where: { ...timeEntryFilter, endTime: { not: null } } },
      },
    });

    const mappedProjects = projects.map((project) => {
      const timeEntries = project.time_entries.flat();

      const totalTime = this.calculateTotalTime(timeEntries);

      return {
        ...project,
        totalTime,
      };
    });

    return mappedProjects;
  }

  async findProjects(filters: SummaryFiltersDto) {
    return this.prisma.project.findMany({
      where: {
        id: filters.projectId,
        workspaceId: filters.workspaceId,
        time_entries: {
          some: this.createTimeEntryFilter(filters),
        },
      },
      include: {
        time_entries: {
          where: this.createTimeEntryFilter(filters),
        },
        members: true,
      },
    });
  }

  private createTimeEntryFilter(filters: { startDate: Date; endDate: Date }) {
    return {
      AND: [
        {
          endTime: {
            not: null, // Exclude entries without an end date
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
}
