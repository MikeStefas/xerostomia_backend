import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma-service';
import { reportDto } from './report-dto';
import { WebDAVClient } from 'webdav';
import * as fs from 'fs';

export async function generatePersonalReport(
  prisma: PrismaService,
  requesterID: number,
  body: reportDto,
) {
  try {
    delete body.userID;

    const report = await prisma.report.create({
      data: {
        userID: requesterID,
        status: body.status!,
        result: body.result!,
      },
    });
    return { message: 'Success', report };
  } catch (error) {
    throw new InternalServerErrorException(`${error}`);
  }
}

export async function generateReportForUser(prisma: PrismaService, body: reportDto) {
    console.log(body.userID);
  try {
    if (!body.userID) {
      throw new ForbiddenException('UserID is required for admin upload');
    }

    const report = await prisma.report.create({
      data: {
        userID: body.userID,
        status: body.status!,
        result: body.result!,
      },
    });
    return { message: 'Success', report };
  } catch (error) {
    if (error instanceof ForbiddenException) throw error;
    throw new InternalServerErrorException(`${error}`);
  }
}

export async function getReports(prisma: PrismaService, userID: number) {
  return prisma.report.findMany({
    where: { userID },
    orderBy: { createdAt: 'desc' },
  });
}

export async function uploadImages(
  webdavClient: WebDAVClient,
  files: Express.Multer.File[],
  userID: number,
  reportID: number
) {
  try {
    const participantDir = `/participant-${userID}`;
    const remoteDir = `${participantDir}/report-${reportID}`;
    const results: any[] = [];

    if (!(await webdavClient.exists(participantDir))) {
      await webdavClient.createDirectory(participantDir);
    }

    if (!(await webdavClient.exists(remoteDir))) {
      await webdavClient.createDirectory(remoteDir);
    } else {
      console.log('Directory exists');
    }

    for (const file of files) {
      const imageBuffer = fs.readFileSync(file.path);
      const remotePath = `${remoteDir}/${file.filename}`;
      
      await webdavClient.putFileContents(remotePath, imageBuffer);
      
      //delete image from api upload folder
      fs.unlinkSync(file.path);
      
      results.push({
        filename: file.originalname,
        filePath: remotePath,
      });
    }

    return {
      message: 'Success',
      uploadedFiles: results,
    };
  } catch (error) {
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
    throw new InternalServerErrorException(`Error uploading images: ${error}`);
  }
}
