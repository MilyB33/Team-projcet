import {
  Controller,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { User as PrismaUser } from '@prisma/client';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GroupEntity } from 'src/groups/entities/group.entity';
import { AddGroupsDto } from './dto/add-groups.dto';
import { UpdateGroupDto } from 'src/groups/dto/update-group.dto';
import { ProjectUserEntity } from './entities/project-user.entity';
import { AddMemberDto } from './dto/add-member.dto';
import { JoinProjectDto } from './dto/join-project.dto';

@ApiBearerAuth()
@Controller('projects')
@ApiTags('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiCreatedResponse({ type: ProjectEntity })
  async create(
    @User() user: PrismaUser,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const project = await this.projectsService.create(
      user.id,
      createProjectDto,
    );

    return new ProjectEntity(project);
  }

  @Post(':id/access_code')
  @ApiOkResponse({ type: ProjectEntity })
  async generateAccessCode(@Param('id', ParseIntPipe) id: number) {
    const project = await this.projectsService.generateNewAccessCode(id);

    return new ProjectEntity(project);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ProjectEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto);

    return new ProjectEntity(project);
  }

  @Post('join')
  @ApiCreatedResponse({ type: ProjectUserEntity })
  async join(@User() user: PrismaUser, @Body() joinProjectDto: JoinProjectDto) {
    const member = await this.projectsService.join(
      joinProjectDto.accessCode,
      user,
    );

    return new ProjectUserEntity(member);
  }

  @Delete(':id/leave')
  @ApiOkResponse({ type: String })
  async leave(@Param('id', ParseIntPipe) id: number, @User() user: PrismaUser) {
    await this.projectsService.leave(id, user);
    return { message: 'Successfully left the project.' };
  }

  @Delete(':id')
  @ApiOkResponse({ type: ProjectEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(id);
    return { message: 'Project was successfully removed' };
  }

  @Get(':id')
  @ApiOkResponse({ type: ProjectEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: PrismaUser,
  ) {
    if (user.typeId === 2) {
      const project = await this.projectsService.findOne(id);

      return new ProjectEntity(project);
    }

    if (user.typeId === 1) {
      const project = await this.projectsService.findEmployeeProject(
        id,
        user.id,
      );

      return new ProjectEntity(project);
    }
  }

  @Post(':id/groups')
  @ApiCreatedResponse({ type: GroupEntity, isArray: true })
  async addGroups(
    @Param('id', ParseIntPipe) id: number,
    @Body() addGroupsDto: AddGroupsDto,
  ) {
    const groups = await this.projectsService.addGroups(id, addGroupsDto);

    return groups.map((group) => new GroupEntity(group));
  }

  @Patch(':id/groups/:groupId')
  @ApiOkResponse({ type: GroupEntity })
  async updateGroup(
    @Param('groupId', ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.updateGroup(id, updateGroupDto);

    return new GroupEntity(group);
  }

  @Delete(':id/groups/:groupId')
  @ApiOkResponse({ type: GroupEntity })
  async removeGroup(
    @Param('id', ParseIntPipe) id: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    await this.projectsService.removeGroup(id, groupId);

    return { message: 'Group successfully deleted' };
  }

  @Get(':id/groups')
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  async findProjectGroups(@Param('id', ParseIntPipe) id: number) {
    const groups = await this.projectsService.findProjectGroups(id);

    return groups.map((group) => new GroupEntity(group));
  }

  @Post(':id/members')
  @ApiCreatedResponse({ type: ProjectUserEntity })
  async addMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() addMemberDto: AddMemberDto,
  ) {
    const projectUser = await this.projectsService.addMember(id, addMemberDto);

    return new ProjectUserEntity(projectUser);
  }

  @Delete(':id/members/:memberId')
  @ApiOkResponse({ type: ProjectUserEntity })
  async removeMember(@Param('memberId', ParseIntPipe) id: number) {
    await this.projectsService.removeMember(id);

    return { message: 'Member successfully deleted' };
  }

  @Get(':id/members')
  @ApiOkResponse({ type: ProjectUserEntity, isArray: true })
  async findProjectMembers(@Param('id', ParseIntPipe) id: number) {
    const members = await this.projectsService.findProjectMembers(id);

    return members.map((member) => new ProjectUserEntity(member));
  }

  @Get()
  @ApiOkResponse({ type: ProjectEntity, isArray: true })
  async findAllProjects(@User() user: PrismaUser) {
    const projects = await this.projectsService.findUserProjects(user);

    return projects.map((project) => new ProjectEntity(project));
  }

  @Get('members/all')
  @ApiOkResponse({ type: ProjectUserEntity, isArray: true })
  async findAllProjectCreatorMembers(@User() user: PrismaUser) {
    const members = await this.projectsService.findUniqueProjectMembers(
      user.id,
    );

    return members.map((member) => new ProjectUserEntity(member));
  }

  @Get(':id/members/active')
  @ApiOkResponse({ type: ProjectUserEntity, isArray: true })
  async findAllActiveMembers(@Param('id', ParseIntPipe) id: number) {
    const members = await this.projectsService.findActiveMembers(id);

    return members.map((member) => new ProjectUserEntity(member));
  }
}
