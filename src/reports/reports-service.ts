import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma-service';
import { reportDto } from './report-dto';
import { Role } from 'src/enums/role-enum';
import { ConfigService } from '@nestjs/config';
import { createClient, WebDAVClient } from 'webdav';
import {
  uploadPersonalReport,
  uploadReportForUser,
  getReports,
  uploadImages,
} from './actions';
import { DoesXExist } from 'src/methods/does-x-exist';

@Injectable()
export class ReportsService {
  private webdavClient: WebDAVClient;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private doesXExist: DoesXExist,
  ) {
    this.webdavClient = createClient(
      this.config.get('NEXTCLOUD_URL')!,
      {
        username: this.config.get('NEXTCLOUD_USERNAME')!,
        password: this.config.get('NEXTCLOUD_PASSWORD')!,
      },
    );
  }

  async viewUserReports(
    requesterID: number,
    requesterRole: Role,
    body: { userID: number },
  ) {
    try {
      const targetUserID = body.userID;

      if (requesterRole === Role.ADMIN) {
        return getReports(this.prisma, targetUserID);
      }

      if (requesterRole === Role.PATIENT) {
        return getReports(this.prisma, requesterID);
      }

      if (requesterRole === Role.CLINICIAN) {
        const isPaired = await  this.doesXExist.doesPairExist(requesterID, targetUserID);

        if (!isPaired) {
          throw new ForbiddenException(
            'Unauthorized to view reports of this userID',
          );
        }

        return getReports(this.prisma, targetUserID);
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
    files?: Express.Multer.File[],
  ) {
    let res: any;
    body.result = "PENDING";
    body.status = "PENDING";

    if (requesterRole === Role.PATIENT) {
      res = await uploadPersonalReport(this.prisma, requesterID, body);
    } 
    else if (requesterRole === Role.ADMIN) {
      res = await uploadReportForUser(this.prisma, body);
    } 
    else {
      throw new ForbiddenException('Unauthorized role');
    }

    //send request to the fastapi to run the model
    void fetch(`http://localhost:8000/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.get('FASTAPI_TOKEN')}`,
      },
      body: JSON.stringify({
        reportID: res.report.reportId,
        userID: requesterRole === Role.ADMIN ? body.userID : requesterID,
      }),
    });

    //handles file upload
    if (files && files.length > 0) {
       const ownerID = requesterRole === Role.ADMIN ? body.userID : requesterID;
       const uploadResult = await uploadImages(this.webdavClient, files, ownerID!, res.report.reportId);
       return { ...res, uploadResult };
    }
    
    
    return res;
  }



  async getImages(requesterID: number, reportID: number, userID: number, requesterRole: Role) {

    if (requesterRole === Role.PATIENT) {
      throw new ForbiddenException('Unauthorized');
    }

    if (requesterRole === Role.CLINICIAN) {
      const isPaired = await this.doesXExist.doesPairExist(requesterID, userID);

      if (!isPaired) {
        throw new ForbiddenException(
          'Unauthorized to view reports of this userID',
        );
      }
    }
    try {
      const remoteDir = `/participant-${userID}/report-${reportID}`;

      const exists = await this.webdavClient.exists(remoteDir);
      if (!exists) {
        return {message: 'No images found'};
      }

      const contents = await this.webdavClient.getDirectoryContents(remoteDir);
      const files = Array.isArray(contents) ? contents : contents.data;

      const imageBuffers = await Promise.all(
        files.map(async (file) => {
          const content = await this.webdavClient.getFileContents(file.filename);
          return Array.isArray(content) || typeof content === 'string' || Buffer.isBuffer(content) 
            ? content 
            : (content as any).data;
        })
      );

      return imageBuffers;
    } catch (error) {
      throw new InternalServerErrorException(`Error fetching images: ${error}`);
    }
  }


}