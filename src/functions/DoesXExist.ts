import { Injectable } from '@nestjs/common';
import { SignUpDto } from 'src/auth/authdto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoesXExist {
  constructor(private prisma: PrismaService) {}

  async doesClinicianExist(clinicianID: number) {
    const clinician = await this.prisma.user.findUnique({
      where: { userID: clinicianID },
    });
    if (!clinician || clinician.role !== 'CLINICIAN') {
      return false;
    } else {
      return true;
    }
  }

  async doesPatientExist(patientID: number) {
    const patient = await this.prisma.user.findUnique({
      where: { userID: patientID },
    });

    if (!patient || patient.role !== 'PATIENT') {
      return false;
    } else {
      return true;
    }
  }

  async doesPairExist(clinicianID: number, patientID: number) {
    const existingPair = await this.prisma.pairs.findFirst({
      where: {
        clinicianID: clinicianID,
        patientID: patientID,
      },
    });

    if (existingPair) {
      return true;
    }
  }

  //for create user
  async userAlreadyExists(body: SignUpDto) {
    if (
      (await this.prisma.user.findUnique({ where: { email: body.email } })) !=
      null
    ) {
      return true;
    }
  }
}
