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
    console.log(body);
      console.log(requesterID);
      console.log(requesterRole);
    if (requesterRole === Role.PATIENT) {
      return this.uploadPersonalReport(requesterID, body);
    }

    if (requesterRole === Role.ADMIN) {
      return //this.uploadReportForUser(requesterID, body);
    }

    throw new ForbiddenException('Unauthorized role');
  }

  private async uploadPersonalReport(requesterID: number, body: reportDto) {
    try {
      if (body.userID === undefined || body.userID === null) delete body.userID;
      
      const data = {
          userID: requesterID,
          ...body,
        }
       console.log(data);
      await this.prisma.report.create({
        data  : data,
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

  handleFileUpload(file: Express.Multer.File) {
    return { message: 'File uploaded successfully', filePath: file.path };
  }

}

