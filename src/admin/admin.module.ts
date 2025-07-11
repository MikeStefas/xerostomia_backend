import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

import { AdminJwtStrategy } from './strategies';

@Module({
  imports : [PrismaModule,JwtModule.register({})],
  providers: [AdminService,PrismaService,AdminJwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
