import { ApiProperty } from '@nestjs/swagger';
import { TimeEntry } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class TimeEntryEntity implements TimeEntry {
  constructor(partial: Partial<TimeEntryEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  projectId: number;

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
  user: UserEntity;

  @ApiProperty()
  @Exclude()
  project: ProjectEntity;
}
