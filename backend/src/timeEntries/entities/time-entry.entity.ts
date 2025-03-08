import { ApiProperty } from '@nestjs/swagger';
import { TimeEntry } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ProjectUserEntity } from 'src/projects/entities/project-user.entity';

export class TimeEntryEntity implements TimeEntry {
  constructor(partial: Partial<TimeEntryEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  projectUserId: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty({ required: false, nullable: true })
  endTime: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  @Exclude()
  projectUser: Partial<ProjectUserEntity>;
}
