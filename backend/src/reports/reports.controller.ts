import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { SummaryFiltersDto } from './dto/summary-filters.dto';
import { UsersSummaryFiltersDto } from './dto/users-summary-filters';
import { WorkspacesFiltersDto } from './dto/workspaces-filters';
import { User } from 'src/common/decorators/user.decorator';
import { User as PrismaUser } from '@prisma/client';

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
  @UsePipes(new ValidationPipe({ transform: true }))
  async projectsSummary(@Query() params: SummaryFiltersDto) {
    const summary = await this.reportsService.projectsSummary(params);

    return summary;
  }

  @Get('users')
  @UsePipes(new ValidationPipe({ transform: true }))
  async usersSummary(@Query() params: UsersSummaryFiltersDto) {
    const summary = await this.reportsService.usersSummary(params);

    return summary;
  }
}
