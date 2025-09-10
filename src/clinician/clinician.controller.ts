import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ClinicianService } from './clinician.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('clinician')
export class ClinicianController {
    constructor(private clinicianService: ClinicianService) {}

    @Post("pair-clinician")
    @UseGuards(JwtGuard)
    pairClinician(@Request() req,@Body() body: { clinicianID: number, patientID: number }) {
        const clinicianID = body.clinicianID;
        const patientID = body.patientID;
        return this.clinicianService.pairClinician(req, clinicianID, patientID);
    }
}
