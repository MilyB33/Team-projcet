import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, WorkspacesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
