import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import * as moment from 'moment';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TimeEntriesService {
  constructor(
    private readonly prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async create(createTimeEntryDto: CreateTimeEntryDto, userId: number) {
    const projectsUser = await this.projectsService.findProjectMember(
      createTimeEntryDto.projectId,
      userId,
    );

    if (!projectsUser) {
      throw new BadRequestException('You are not a member of this project!');
    }

    delete createTimeEntryDto.projectId;

    return this.prisma.timeEntry.create({
      data: { ...createTimeEntryDto, projectUserId: projectsUser.id },
    });
  }

  async end(entryId: number, userId: number) {
    const projectUser = this.projectsService.findMemberByEntryId(
      entryId,
      userId,
    );

    if (!projectUser) {
      throw new BadRequestException('You are not a member of this project!');
    }

    return this.update({ endTime: new Date() }, entryId);
  }

  async update(updateTimeEntryDto: UpdateTimeEntryDto, id: number) {
    if (updateTimeEntryDto.endTime && updateTimeEntryDto.startTime) {
      if (
        new Date(updateTimeEntryDto.endTime) <=
        new Date(updateTimeEntryDto.startTime)
      ) {
        throw new BadRequestException(
          'End time must be later than start time.',
        );
      }
    }

    return this.prisma.timeEntry.update({
      where: { id },
      data: updateTimeEntryDto,
    });
  }

  async delete(id: number) {
    return this.prisma.timeEntry.delete({ where: { id } });
  }

  async findProjectEntries(projectId: number) {
    return this.prisma.timeEntry.findMany({
      where: { projectUser: { projectId }, endTime: { not: null } },
    });
  }

  async findUserEntries(userId: number) {
    return this.prisma.timeEntry.findMany({
      where: { projectUser: { userId }, endTime: { not: null } },
    });
  }

  async findUserLastUnfinishedTimeEntry(userId: number) {
    return this.prisma.timeEntry.findFirst({
      where: { projectUser: { userId }, endTime: null },
      include: { projectUser: true },
    });
  }

  async findLastWeekEntries(userId: number) {
    const oneWeekAgo = moment().subtract(7, 'days').toDate();

    return this.prisma.timeEntry.findMany({
      where: {
        projectUser: { userId },
        createdAt: { gte: oneWeekAgo },
        endTime: { not: null },
      },
      include: { projectUser: true },
    });
  }

  async findUnfinishedEntriesStartedNineHoursAgo() {
    const eightHoursAgo = moment().subtract(9, 'hours').toDate();

    return this.prisma.timeEntry.findMany({
      where: { createdAt: { lt: eightHoursAgo }, endTime: null },
      include: {
        projectUser: {
          include: { user: true, project: true },
        },
      },
    });
  }
}
