import { Module } from '@nestjs/common';
import { TimeEntriesService } from './timeEntries.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TimeEntriesController } from './TimeEntries.controller';

@Module({
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService],
  imports: [PrismaModule],
  exports: [TimeEntriesService],
})
export class TimeEntriesModule {}
