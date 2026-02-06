import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { reportDto } from './report.dto';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async viewUserReports(
    requesterID: number,
    requesterRole: Role,
    body: { userID: number },
  ) {
    try {
      switch (requesterRole) {
        case Role.ADMIN: {
          const reports = await this.prisma.report.findMany({
            where: { userID: body.userID },
          });
          return reports;
        }

        case Role.CLINICIAN: {
          const clinicianID = requesterID;
          const userID = body.userID;
          const pair = await this.prisma.pairs.findFirst({
            where: { clinicianID: clinicianID, patientID: userID },
          });

          if (pair === null) {
            throw new ForbiddenException(
              'Unauthorized to view reports of this userID',
            );
          } else {
            const reports = await this.prisma.report.findMany({
              where: { userID: userID },
            });
            return reports;
          }
        }

        case Role.PATIENT: {
          const reports = await this.prisma.report.findMany({
            where: { userID: requesterID },
          });
          return reports;
        }
      }
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }
  async uploadReport(
    requesterID: number,
    requesterRole: Role,
    body: reportDto,
  ) {
    if (requesterRole !== Role.PATIENT) {
      throw new ForbiddenException(
        'You do not have permission to upload reports',
      );
    }
    try {
      await this.prisma.report.create({
        data: {
          userID: requesterID,
          tongue: body.tongue,
          tonguePercentage: body.tonguePercentage,
          teeth: body.teeth,
          teethPercentage: body.teethPercentage,
          saliva: body.saliva,
          salivaPercentage: body.salivaPercentage,
          pain: body.pain,
          painPercentage: body.painPercentage,
        },
      });
      return { message: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
