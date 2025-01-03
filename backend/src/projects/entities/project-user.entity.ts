import { ApiProperty } from '@nestjs/swagger';
import { ProjectUser } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ProjectEntity } from './project.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProjectUserGroupEntity } from './project-user-group.entity';

export class ProjectUserEntity implements ProjectUser {
  constructor(partial: Partial<ProjectUserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  joinedAt: Date;

  @ApiProperty()
  @Exclude()
  project: ProjectEntity;

  @ApiProperty()
  @Exclude()
  user: UserEntity;

  @ApiProperty()
  @Exclude()
  groups: ProjectUserGroupEntity[];
}
