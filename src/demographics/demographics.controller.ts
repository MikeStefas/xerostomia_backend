import { Body, Controller, Patch, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from 'guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemographicsService } from './demographics.service';
import { DemographicsDto } from './demographicsDTO';

@Controller('demographics')
export class DemographicsController {
     constructor(private prisma: PrismaService, private demographicsService: DemographicsService) {}

    @Post("create-demographic-data")
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe({whitelist:true}))
    createDemographicData(@Request() req ,@Body () body: DemographicsDto) {    
            return this.demographicsService.createDemographicData(req,body);
    }

    @Patch("update-demographic-data")
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    updateDemographics(@Request() req,@Body () body: DemographicsDto) {
            return this.demographicsService.updateDemographicData(req,body);
            }

    @Post("view-demographic-data")
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    viewDemographicData(@Request() req: any, @Body() body: { userID: number }) {
        return this.demographicsService.viewDemographicData(req,body);
            }
}
