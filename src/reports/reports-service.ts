import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma-service';
import { reportDto } from './report-dto';
import { Role } from 'src/enums/role-enum';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async viewUserReports(
    requesterID: number,
    requesterRole: Role,
    body: { userID: number },
  ) {
    try {
      const targetUserID = body.userID;

      if (requesterRole === Role.ADMIN) {
        return this.getReports(targetUserID);
      }

      if (requesterRole === Role.PATIENT) {
        return this.getReports(requesterID);
      }

      if (requesterRole === Role.CLINICIAN) {
        const isPaired = await this.prisma.pairs.findFirst({
          where: { clinicianID: requesterID, patientID: targetUserID },
        });

        if (!isPaired) {
          throw new ForbiddenException(
            'Unauthorized to view reports of this userID',
          );
        }

        return this.getReports(targetUserID);
      }

      throw new ForbiddenException('Unauthorized role');
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
          ...body,
        },
      });
      return { message: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(`${error}`);
    }
  }

  private async getReports(userID: number) {
    return this.prisma.report.findMany({
      where: { userID },
      orderBy: { createdAt: 'desc' },
    });
  }
}

