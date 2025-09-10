import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { DemographicsService } from './demographics.service';

@Controller('demographics')
export class DemographicsController {
    constructor(private prisma: PrismaService, private demographicsService: DemographicsService) {}

    @Post("create-demographic-data")
    @UseGuards(JwtGuard)
    createDemographicData(@Request() req ,@Body () body: {
        userID: number,
        yearOfBirth : number,
        gender : string
    }) {    
            return this.demographicsService.createDemographicData(req,body);
    }

    @Patch("update-demographic-data")
    @UseGuards(JwtGuard)
    updateDemographics(@Request() req,@Body () body: {
            userID: number,
            yearOfBirth : number,
            gender : string
            }) {
            return this.demographicsService.updateDemographicData(req,body);
            }

    @Post("view-demographic-data")
    @UseGuards(JwtGuard)
    viewDemographicData(@Request() req: any, @Body() body: { userID: number }) {
        return this.demographicsService.viewDemographicData(req,body);
            }
}
