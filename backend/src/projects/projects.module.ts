import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { WorkspacesModule } from 'src/workspaces/workspaces.module';
import { GroupsService } from 'src/groups/groups.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, GroupsService],
  imports: [PrismaModule, UsersModule, WorkspacesModule],
  exports: [ProjectsService],
})
export class ProjectsModule {}
