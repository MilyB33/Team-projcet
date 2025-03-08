import { Module } from '@nestjs/common';
import { TimeEntriesService } from './timeEntries.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeEntriesController } from './TimeEntries.controller';
import { TimeEntryListener } from './TimeEntries.listener';

@Module({
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService, TimeEntryListener],
  imports: [PrismaModule],
  exports: [TimeEntriesService],
})
export class TimeEntriesModule {}
