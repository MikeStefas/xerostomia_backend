import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicianService {
  constructor(private prisma: PrismaService) {}

  async pairClinician(req, clinicianID: number, patientID: number) {
    if (req.user.role !== 'ADMIN') {
      return { message: 'Unauthorized' };
    }
    try {
      // check if the clinician exists
      const clinician = await this.prisma.user.findUnique({
        where: { userID: clinicianID },
      });

      if (!clinician || clinician.role !== 'CLINICIAN') {
        return { message: 'Clinician does not exist' };
      }

      // check if the patient exists
      const patient = await this.prisma.user.findUnique({
        where: { userID: patientID },
      });

      if (!patient || patient.role !== 'USER') {
        return { message: 'Patient does not exist' };
      }

      // check if the pair already exists
      const existingPair = await this.prisma.pairs.findFirst({
        where: {
          clinicianID: clinicianID,
          patientID: patientID,
        },
      });

      if (existingPair) {
        return { message: 'Already paired' };
      }

      // create the pair if it doesn't exist
      await this.prisma.pairs.create({
        data: {
          clinicianID: clinicianID,
          patientID: patientID,
        },
      });

      return { message: 'Users are now paired' };
    } catch (error) {
      return { message: '${error}' };
    }
  }
}
