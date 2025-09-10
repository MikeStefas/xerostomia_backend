import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaController } from 'src/prisma/prisma.controller';

@Module({
  imports : [PrismaModule,JwtModule.register({})],
  providers: [ReportsService,],
  controllers: [ReportsController, PrismaController]
})
export class ReportsModule {}
