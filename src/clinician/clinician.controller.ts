import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ClinicianJwtGuard } from './guard';
import { ClinicianService } from './clinician.service';
import { use } from 'passport';

@Controller('clinician')
export class ClinicianController {
    constructor(private clinicianService: ClinicianService) {}

    @Get("view-reports")
    @UseGuards(ClinicianJwtGuard)
    viewReports(@Request() req: any) {

        return this.clinicianService.viewReports(req);
    }

    @Get("view-patients")
    @UseGuards(ClinicianJwtGuard)
    viewPatients(@Request() req: any) {

        return this.clinicianService.viewPatients(req);
    }

    @Post("view-user-data")
    @UseGuards(ClinicianJwtGuard)
    viewUserData(@Request() req: any, @Body() body: { userID: number }) {
        const userID = body.userID;
        return this.clinicianService.viewUserData(userID);
    }

    @Post("view-user-reports")
    @UseGuards(ClinicianJwtGuard)
    viewUserReports(@Request() req: any, @Body() body: { userID: number }) {
        const userID = body.userID;
        return this.clinicianService.viewUserReports(userID);
    } 
}
