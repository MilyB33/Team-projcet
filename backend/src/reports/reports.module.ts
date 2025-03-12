import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeEntriesModule } from 'src/timeEntries/timeEntries.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrismaModule, TimeEntriesModule, ProjectsModule, WorkspacesModule],
  exports: [ReportsService],
})
export class ReportsModule {}
