import { ApiProperty } from '@nestjs/swagger';
import { Group } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ProjectEntity } from 'src/projects/entities/project.entity';

export class GroupEntity implements Group {
  constructor(partial: Partial<GroupEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  @Exclude()
  project: ProjectEntity;

  @ApiProperty()
  @Exclude()
  members: any;
}
