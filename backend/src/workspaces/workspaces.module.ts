import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WorkspacesService } from './workspaces.service';
import { UsersModule } from 'src/users/users.module';
import { WorkspacesController } from './workspaces.controller';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  imports: [PrismaModule, UsersModule],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
