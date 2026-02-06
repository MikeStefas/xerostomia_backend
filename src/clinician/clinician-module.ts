import { Module } from '@nestjs/common';
import { ClinicianService } from './clinician-service';
import { ClinicianController } from './clinician-controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma-module';
import { PrismaService } from 'src/prisma/prisma-service';
import { DoesXExist } from 'src/methods/does-x-exist';

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  providers: [ClinicianService, PrismaService, DoesXExist],
  controllers: [ClinicianController],
})
export class ClinicianModule {}
