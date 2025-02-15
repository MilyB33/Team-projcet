import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { SummaryFiltersDto } from './dto/summary-filters.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UsersSummaryFiltersDto } from './dto/users-summary-filters';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async projectsSummary(filters: SummaryFiltersDto) {
    const projects = await this.findProjects(filters);

    const projectsWithTotalTime = this.calculateTotalProjectTotalTime(
      projects as ProjectEntity[],
    );

    return {
      projects: projectsWithTotalTime,
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
      },
    });
  }

  private createTimeEntryFilter(filters: SummaryFiltersDto) {
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
                gte: filters.startTime
                  ? new Date(filters.startTime)
                  : undefined,
                lte: filters.endTime ? new Date(filters.endTime) : undefined,
              },
            },
            {
              endTime: {
                gte: filters.startTime
                  ? new Date(filters.startTime)
                  : undefined,
                lte: filters.endTime ? new Date(filters.endTime) : undefined,
              },
            },
          ],
        },
      ],
    };
  }

  private calculateTotalProjectTotalTime(projects: ProjectEntity[]) {
    const projectsWithTotalTime = projects.map((project) => {
      const totalProjectTime = project.time_entries.reduce((acc, entry) => {
        const start = moment(entry.startTime);
        const end = moment(entry.endTime);
        return acc + end.diff(start);
      }, 0);

      const duration = moment.duration(totalProjectTime);
      const hours = duration.hours();
      const minutes = duration.minutes();

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      return {
        ...project,
        totalTime: formattedTime,
      };
    });
    return projectsWithTotalTime;
  }
}
