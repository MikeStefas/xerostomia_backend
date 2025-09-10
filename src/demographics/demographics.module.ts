import { Module } from '@nestjs/common';
import { DemographicsController } from './demographics.controller';
import { DemographicsService } from './demographics.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaController } from 'src/prisma/prisma.controller';

@Module({
    imports : [PrismaModule,JwtModule.register({})],
    controllers: [DemographicsController, PrismaController],
    providers: [DemographicsService]
})
export class DemographicsModule {}
