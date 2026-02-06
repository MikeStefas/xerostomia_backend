import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClinicianService } from './clinician.service';
import { AdminJwtGuard } from 'guard/admin.guard';
import { PairClinicianDto } from './pairClinicianDTO';

@Controller('clinician')
export class ClinicianController {
  constructor(private clinicianService: ClinicianService) {}

  @Post('pair-clinician')
  @UseGuards(AdminJwtGuard)
  //@UsePipes(new ValidationPipe({ whitelist: true }))
  pairClinician(@Request() req, @Body() body: PairClinicianDto) {
    const clinicianID = body.clinicianID;
    const patientID = body.patientID;
    return this.clinicianService.pairClinician(clinicianID, patientID);
  }
}
