import { ApiProperty } from '@nestjs/swagger';
import { ProjectUserGroup } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ProjectUserEntity } from './project-user.entity';
import { GroupEntity } from 'src/groups/entities/group.entity';

export class ProjectUserGroupEntity implements ProjectUserGroup {
  constructor(partial: Partial<ProjectUserGroupEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  projectUserId: number;

  @ApiProperty()
  groupId: number;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty()
  @Exclude()
  projectUser: ProjectUserEntity;

  @ApiProperty()
  @Exclude()
  group: GroupEntity;
}
