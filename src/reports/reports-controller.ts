import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReportsService } from './reports-service';
import { JwtGuard } from 'guard';
import { reportDto } from 'src/reports/report-dto';
import { BasicUserInfo } from 'src/auth/auth-dto';
import { Role } from 'src/enums/role-enum';
import {  FilesInterceptor } from '@nestjs/platform-express';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('view-user-reports')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  viewUserReports(
    @Request() req: BasicUserInfo,
    @Body() body: { userID: number },
  ) {
    return this.reportsService.viewUserReports(
      req.user.userID,
      req.user.role as Role,
      body,
    );
  }

  @Post('upload-report')
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  uploadReport(
    @Request() req: BasicUserInfo,
    @Body() body: reportDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.reportsService.uploadReport(
      req.user.userID,
      req.user.role as Role,
      body,
      files,
    );
  }


  @Get('images/:userID/:reportID')
  @UseGuards(JwtGuard)
  getImages(@Request() req: BasicUserInfo,@Param("reportID") reportID: number,@Param("userID") userID: number) {
    return this.reportsService.getImages(req.user.userID, reportID, userID, req.user.role as Role);
  }


}