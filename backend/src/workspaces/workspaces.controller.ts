import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Body,
  UseGuards,
  Patch,
  Get,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceEntity } from './entities/workspace.entity';
import { User } from 'src/common/decorators/user.decorator';
import { User as PrismaUser } from '@prisma/client';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@ApiBearerAuth()
@Controller('workspaces')
@ApiTags('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @ApiCreatedResponse({ type: WorkspaceEntity })
  async create(
    @User() user: PrismaUser,
    @Body() createWorkspaceDto: Omit<CreateWorkspaceDto, 'user_id'>,
  ) {
    const workspace = await this.workspacesService.create({
      user_id: user.id,
      ...createWorkspaceDto,
    });

    return workspace;
  }

  @Patch(':workspace_id')
  @ApiCreatedResponse({ type: WorkspaceEntity })
  async update(
    @Param('workspace_id', ParseIntPipe) workspace_id: number,
    @Body() updateWorkspaceDto: Omit<UpdateWorkspaceDto, 'user_id'>,
  ) {
    const workspace = await this.workspacesService.update(
      workspace_id,
      updateWorkspaceDto,
    );

    return workspace;
  }

  @Get(':workspace_id')
  @ApiOkResponse({ type: WorkspaceEntity })
  async findOneByUser(@User() user: PrismaUser) {
    return new WorkspaceEntity(await this.workspacesService.findOne(user.id));
  }

  @Get()
  @ApiOkResponse({ type: WorkspaceEntity, isArray: true })
  async findAllWorkspaces(@User() user: PrismaUser) {
    const workspaces = await this.workspacesService.findByCreator(user.id);
    return workspaces.map((workspace) => new WorkspaceEntity(workspace));
  }

  @Delete(':workspace_id')
  @ApiOkResponse({ type: WorkspaceEntity })
  async remove(@Param('workspace_id', ParseIntPipe) workspace_id: number) {
    return this.workspacesService.remove(workspace_id);
  }
}
