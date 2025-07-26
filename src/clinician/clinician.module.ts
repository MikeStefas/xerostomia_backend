import { Module } from '@nestjs/common';
import { ClinicianService } from './clinician.service';
import { ClinicianController } from './clinician.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClinicianJwtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({}),PrismaModule],
  providers: [ClinicianService,PrismaService,ClinicianJwtStrategy],
  controllers: [ClinicianController]
})
export class ClinicianModule {}
