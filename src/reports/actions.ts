import {  InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma-service';
import { WebDAVClient } from 'webdav';
import * as fs from 'fs';
import { ConfigService } from "@nestjs/config";

export default async function microserviceLLMCall(config: ConfigService, files: Express.Multer.File[]) {
  try {

    const formData = new FormData();
    files.forEach((file: Express.Multer.File) => {
      const imageBuffer = fs.readFileSync(file.path);
      const uint8Array = new Uint8Array(imageBuffer);
      const blob = new Blob([uint8Array], { type: file.mimetype });
      formData.append('files', blob, file.originalname);
    });

    const r = await fetch(`${config.get('FASTAPI_URL')}/diagnose`, { 
      method: 'POST',
      headers: {
      },
      body: formData,
    });
    
    return await r.json();
  } catch (error) {
    console.log(error);
    return {message: 'Could not connect to the LLM'};
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
