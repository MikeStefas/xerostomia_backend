import { ClinicianService } from './clinician.service';
import { AdminJwtGuard } from 'guard/admin.guard';
import { PairClinicianDto } from './pairClinicianDTO';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('clinician')
export class ClinicianController {
  constructor(private clinicianService: ClinicianService) {}

  @Post('pair-clinician')
  @UseGuards(AdminJwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  pairClinician(@Body() body: PairClinicianDto) {
    const clinicianID = body.clinicianID;
    const patientID = body.patientID;
    return this.clinicianService.pairClinician(clinicianID, patientID);
  }
}
