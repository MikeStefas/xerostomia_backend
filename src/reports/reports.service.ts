import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async viewUserReports(req, body) {
    const role = req.user.role;

    if (role === 'ADMIN') {
      let reports = await this.prisma.report.findMany({
        where: { userID: body.userID },
      });
      return reports;
    }

    if (role === 'CLINICIAN') {
      const clinicianID = req.user.userID;
      const userID = body.userID;
      let pair = await this.prisma.pairs.findFirst({
        where: { clinicianID: clinicianID, patientID: userID },
      });

      if (pair === null) {
        return { message: 'Unauthorized to view reports of this userID' };
      } else {
        let reports = await this.prisma.report.findMany({
          where: { userID: userID },
        });
        return reports;
      }
    }

    if (role === 'PATIENT') {
      let reports = await this.prisma.report.findMany({
        where: { userID: req.user.userID },
      });
      return reports;
    }
  }

  async uploadReport(req, body) {
    const role = req.user.role;
    if (role !== 'PATIENT') {
      return { message: 'You do not have permission to upload reports' };
    }

    await this.prisma.report.create({
      data: {
        userID: req.user.userID,
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
  }
}
