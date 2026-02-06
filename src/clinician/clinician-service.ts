import { Injectable } from '@nestjs/common';
import { DoesXExist } from 'src/methods/does-x-exist';
import { PrismaService } from 'src/prisma/prisma-service';
@Injectable()
export class ClinicianService {
  constructor(
    private prisma: PrismaService,
    private doesXExist: DoesXExist,
  ) {}

  async pairClinician(clinicianID: number, patientID: number) {
    try {
      // check if the clinician exists

      if ((await this.doesXExist.doesClinicianExist(clinicianID)) === false)
        return { message: 'Clinician does not exist' };

      // check if the patient exists
      if ((await this.doesXExist.doesPatientExist(patientID)) === false)
        return { message: 'Patient does not exist' };

      // check if the pair already exists
      if (
        (await this.doesXExist.doesPairExist(clinicianID, patientID)) === true
      )
        return { message: 'Pair already exists' };

      // create the pair if it doesn't exist
      await this.prisma.pairs.create({
        data: {
          clinicianID: clinicianID,
          patientID: patientID,
        },
      });

      return { message: 'Users are now paired' };
    } catch (error) {
      return { message: `${error}` };
    }
  }
}
