import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClinicianService } from './clinician.service';
import { JwtGuard } from 'guard';
import { PairClinicianDto } from './pairClinicianDTO';

@Controller('clinician')
export class ClinicianController {
    constructor(private clinicianService: ClinicianService) {}

    @Post("pair-clinician")
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    pairClinician(@Request() req,@Body() body: PairClinicianDto) {
        const clinicianID = body.clinicianID;
        const patientID = body.patientID;
        return this.clinicianService.pairClinician(req, clinicianID, patientID);
    }
}
