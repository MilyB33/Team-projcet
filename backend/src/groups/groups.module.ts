import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GroupsService } from './groups.service';

@Module({
  controllers: [],
  providers: [GroupsService],
  imports: [PrismaModule],
  exports: [GroupsService],
})
export class GroupsModule {}
