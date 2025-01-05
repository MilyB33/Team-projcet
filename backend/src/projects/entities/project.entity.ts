import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';
import { WorkspaceEntity } from 'src/workspaces/entities/workspace.entity';
import { ProjectUserEntity } from './project-user.entity';
import { GroupEntity } from 'src/groups/entities/group.entity';

export class ProjectEntity implements Project {
  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string;

  @ApiProperty()
  workspaceId: number;

  @ApiProperty()
  createdBy: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  accessCode: string;

  @ApiProperty()
  @Exclude()
  workspace: WorkspaceEntity;

  @ApiProperty()
  @Exclude()
  admin: UserEntity;

  @ApiProperty()
  @Exclude()
  members: ProjectUserEntity[];

  @ApiProperty()
  @Exclude()
  groups: GroupEntity[];
}
