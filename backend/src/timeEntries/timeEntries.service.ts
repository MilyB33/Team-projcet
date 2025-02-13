import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTimeEntryDto: CreateTimeEntryDto, userId: number) {
    return this.prisma.timeEntry.create({
      data: { ...createTimeEntryDto, userId },
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
    return this.prisma.timeEntry.findMany({ where: { projectId } });
  }

  async findUserEntries(userId: number) {
    return this.prisma.timeEntry.findMany({ where: { userId } });
  }
}
