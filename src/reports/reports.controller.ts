import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from 'guard';
import { reportDto } from 'src/reports/report.dto';
import { BasicUserInfo } from 'src/auth/authdto';

@Controller('reports')
export class ReportsController {
  constructor(private userService: ReportsService) {}

  @Post('view-user-reports')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  viewUserReports(
    @Request() req: BasicUserInfo,
    @Body() body: { userID: number },
  ) {
    return this.userService.viewUserReports(req, body);
  }

  @Post('upload-report')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  uploadReport(@Request() req: BasicUserInfo, @Body() body: reportDto) {
    return this.userService.uploadReport(req, body);
  }
}
