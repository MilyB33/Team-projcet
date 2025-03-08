import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import * as moment from 'moment';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTimeEntryDto: CreateTimeEntryDto) {
    return this.prisma.timeEntry.create({
      data: { ...createTimeEntryDto },
    });
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
      where: { projectUser: { projectId } },
    });
  }

  async findUserEntries(userId: number) {
    return this.prisma.timeEntry.findMany({
      where: { projectUser: { userId } },
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
