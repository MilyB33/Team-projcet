import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createWorkspaceDto: CreateWorkspaceDto) {
    const user = await this.usersService.findOne(createWorkspaceDto.user_id, {
      type: true,
    });

    if (user.type.name !== 'employer') {
      throw new BadRequestException(
        'Only employer users can create workspaces',
      );
    }

    const userWorkspaces = await this.findByCreator(user.id);

    if (userWorkspaces.length === 5) {
      throw new BadRequestException('You can create only 5 workspaces');
    }

    return this.prisma.workspace.create({
      data: {
        created_by: createWorkspaceDto.user_id,
        name: createWorkspaceDto.name,
      },
    });
  }

  async findByCreator(id: number) {
    const workspaces = await this.prisma.workspace.findMany({
      where: { created_by: id },
    });

    return workspaces;
  }

  async update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.prisma.workspace.update({
      where: { id },
      data: updateWorkspaceDto,
    });
  }

  async remove(id: number) {
    return this.prisma.workspace.delete({ where: { id } });
  }

  async findOne(id: number) {
    return this.prisma.workspace.findUnique({
      where: { id },
    });
  }
}
