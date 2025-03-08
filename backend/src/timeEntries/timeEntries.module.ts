import { Module } from '@nestjs/common';
import { TimeEntriesService } from './timeEntries.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeEntriesController } from './TimeEntries.controller';
import { TimeEntryListener } from './TimeEntries.listener';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService, TimeEntryListener],
  imports: [PrismaModule, ProjectsModule],
  exports: [TimeEntriesService],
})
export class TimeEntriesModule {}
