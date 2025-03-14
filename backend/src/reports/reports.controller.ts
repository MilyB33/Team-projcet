import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { MembersFiltersDto } from './dto/members-filters';
import { WorkspacesFiltersDto } from './dto/workspaces-filters';
import { User } from 'src/common/decorators/user.decorator';
import { User as PrismaUser } from '@prisma/client';
import { ProjectsFiltersDto } from './dto/projects-filters';

@ApiBearerAuth()
@Controller('reports')
@ApiTags('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('workspaces')
  async workspacesSummary(
    @Query() params: WorkspacesFiltersDto,
    @User() user: PrismaUser,
  ) {
    const summary = await this.reportsService.workspacesSummary(
      params,
      user.id,
    );

    return summary;
  }

  @Get('projects')
  async projectsSummary(
    @Query() params: ProjectsFiltersDto,
    @User() user: PrismaUser,
  ) {
    if (user.typeId === 2) {
      const summary = await this.reportsService.projectsSummary(
        params,
        user.id,
      );

      return summary;
    }

    if (user.typeId === 1) {
      const summary = await this.reportsService.employeeProjectSummary(
        params,
        user.id,
      );

      return summary;
    }
  }

  @Get('members')
  async membersSummary(
    @Query() params: MembersFiltersDto,
    @User() user: PrismaUser,
  ) {
    const summary = await this.reportsService.membersSummary(params, user.id);

    return summary;
  }

  @Get('summary')
  async employeeSummary(@User() user: PrismaUser) {
    if (user.typeId === 1) {
      const summary = await this.reportsService.employeeOverviewReport(user.id);

      return summary;
    }

    if (user.typeId === 2) {
      const summary = await this.reportsService.employerOverviewReport(user.id);

      return summary;
    }
  }
}
