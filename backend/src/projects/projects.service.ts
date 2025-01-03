import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { GroupsService } from 'src/groups/groups.service';
import { AddGroupsDto } from './dto/add-groups.dto';
import { UpdateGroupDto } from '../groups/dto/update-group.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly workspacesService: WorkspacesService,
    private readonly groupsService: GroupsService,
  ) {}

  async create(userId: number, createProjectDto: CreateProjectDto) {
    const user = await this.usersService.findOne(userId, { type: true });

    if (user.type.name !== 'employer') {
      throw new BadRequestException('Only employer users can create projects');
    }

    const workspace = await this.workspacesService.findByCreator(userId);

    if (!workspace) {
      throw new BadRequestException(
        'Only owner of workspace can create projects',
      );
    }

    const userProjects = await this.findByCreator(userId);

    if (userProjects.length === 5) {
      throw new BadRequestException(
        'You can create only 5 projects for workspace',
      );
    }

    const project = await this.prisma.project.create({
      data: {
        createdBy: userId,
        name: createProjectDto.name,
        description: createProjectDto.description,
        workspaceId: createProjectDto.workspaceId,
        groups: { createMany: { data: createProjectDto.groups || [] } },
      },
    });

    return project;
  }

  async update(id: number, updateProjectDto: Omit<UpdateProjectDto, 'groups'>) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async findByCreator(id: number) {
    const projects = await this.prisma.project.findMany({
      where: { createdBy: id },
    });

    return projects;
  }

  async addGroups(projectId: number, addGroupsDto: AddGroupsDto) {
    const groups = await this.groupsService.findAll(projectId);

    const names = addGroupsDto.groups.map((group) => group.name);

    const groupWithName = groups.find((group) => {
      return names.includes(group.name);
    });

    if (!!groupWithName) {
      throw new BadRequestException(
        `Group with ${groupWithName.name} already exists`,
      );
    }

    return this.groupsService.createGroups(projectId, addGroupsDto.groups);
  }

  async updateGroup(id: number, updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  async removeGroup(projectId: number, id: number) {
    const groups = await this.groupsService.findAll(projectId);

    const containsGroup = groups.some((group) => group.id === id);

    if (!containsGroup) {
      throw new BadRequestException("Group doesn't belong to this project");
    }

    return this.groupsService.remove(id);
  }

  async findProjectGroups(projectId: number) {
    return await this.groupsService.findAll(projectId);
  }

  async addMember(projectId: number, addMemberDto: AddMemberDto) {
    const project = await this.findOne(projectId);

    if (!project) {
      throw new BadRequestException('Project not found');
    }

    const user = await this.usersService.findOne(addMemberDto.user);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const groups = addMemberDto.groups.map((group) => ({ id: group }));

    const projectUser = await this.prisma.projectUser.create({
      data: {
        projectId: projectId,
        userId: addMemberDto.user,
        groups: { connect: groups },
      },
    });

    return projectUser;
  }

  async removeMember(id: number) {
    return this.prisma.projectUser.delete({ where: { id } });
  }

  async findProjectMembers(projectId: number) {
    return this.prisma.projectUser.findMany({ where: { projectId } });
  }
}
