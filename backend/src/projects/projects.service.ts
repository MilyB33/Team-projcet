import * as moment from 'moment';
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
import * as crypto from 'crypto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly workspacesService: WorkspacesService,
    private readonly groupsService: GroupsService,
  ) {}

  private readonly PROJECT_INCLUDE = {
    workspace: true,
    members: {
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    },
  };

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

    const accessCode = await this.generateAccessCode();

    const project = await this.prisma.project.create({
      data: {
        createdBy: userId,
        name: createProjectDto.name,
        description: createProjectDto.description,
        workspaceId: createProjectDto.workspaceId,
        members: { create: { userId } },
        accessCode,
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

  async generateNewAccessCode(id: number) {
    const accessCode = await this.generateAccessCode();

    return this.prisma.project.update({
      where: { id },
      data: { accessCode },
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: this.PROJECT_INCLUDE,
    });
  }

  async findUserProjects(user: UserEntity) {
    // TODO: change this to base on type name rather id
    const isEmployer = user.typeId === 2;
    const isStandard = user.typeId === 1;

    if (isEmployer) {
      return await this.findByCreator(user.id);
    }

    if (isStandard) {
      return await this.findByMember(user.id);
    }

    return [];
  }

  async findByCreator(id: number) {
    const projects = await this.prisma.project.findMany({
      where: { createdBy: id },
      include: this.PROJECT_INCLUDE,
    });

    return projects;
  }

  async findByMember(id: number) {
    const projects = await this.prisma.project.findMany({
      where: { members: { some: { userId: id } } },
      include: this.PROJECT_INCLUDE,
    });
    console.log(projects);
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

  async join(accessCode: string, user: UserEntity) {
    const project = await this.findByAccessCode(accessCode);

    if (!project) {
      throw new BadRequestException('Invalid access code');
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (project.members.some((member) => member.user.id === user.id)) {
      throw new BadRequestException('User already joined the project.');
    }

    const projectUser = await this.prisma.projectUser.create({
      data: {
        projectId: project.id,
        userId: user.id,
      },
    });

    return projectUser;
  }

  async leave(id: number, user: UserEntity) {
    const project = await this.findOne(id);

    if (!project) {
      throw new BadRequestException('Project not found.');
    }

    const isMember = project.members.some(
      (member) => member.userId === user.id,
    );

    if (!isMember) {
      throw new BadRequestException('user is not a member of the project.');
    }

    const projectUser = await this.prisma.projectUser.findFirst({
      where: { userId: user.id, projectId: id },
    });

    await this.prisma.projectUser.delete({ where: { id: projectUser.id } });
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

  async findByAccessCode(accessCode: string) {
    return this.prisma.project.findFirst({
      where: { accessCode },
      include: this.PROJECT_INCLUDE,
    });
  }

  async findActiveMembers(projectId: number) {
    const members = await this.prisma.projectUser.findMany({
      where: {
        projectId,
        time_entries: { some: { endTime: null } },
      },
      select: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        time_entries: {
          where: {
            endTime: null,
          },
          take: 1,
        },
      },
    });

    const mappedMembers = members.map((member) => {
      const totalTime = this.calculateTotalTime(
        member.time_entries[0].startTime,
      );

      return {
        ...member,
        totalTime,
      };
    });

    return mappedMembers;
  }

  async findUniqueProjectMembers(userId: number) {
    const projects = await this.prisma.project.findMany({
      where: { createdBy: userId },
      select: {
        id: true,
        name: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const uniqueMembers = Array.from(
      new Map(
        projects
          .flatMap((project) => project.members)
          .map((m) => [m.user.id, m.user]),
      ).values(),
    );

    return uniqueMembers;
  }

  private async generateAccessCode() {
    let validAccessCode = false;
    let accessCode = '';

    while (!validAccessCode) {
      accessCode = crypto.randomBytes(4).toString('hex');

      const projectWithAccessCode = await this.findByAccessCode(accessCode);

      if (projectWithAccessCode) continue;

      validAccessCode = true;
    }

    return accessCode;
  }

  // TODO: move to util or common service
  private calculateTotalTime(startTime: Date) {
    const currentTime = moment(); // Get the current time
    const start = moment(startTime); // Convert startTime to moment object
    const totalTime = currentTime.diff(start, 'milliseconds'); // Calculate difference in milliseconds

    const duration = moment.duration(totalTime);
    const hours = Math.floor(duration.asHours()); // Total hours
    const minutes = duration.minutes(); // Remaining minutes

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedTime;
  }
}
