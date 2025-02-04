import { ApiProperty } from '@nestjs/swagger';
import { Workspace } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';

export class WorkspaceEntity implements Workspace {
  constructor(partial: Partial<WorkspaceEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  created_by: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @Exclude()
  admin: UserEntity;

  @ApiProperty()
  @Exclude()
  projectsCount: number;
}
