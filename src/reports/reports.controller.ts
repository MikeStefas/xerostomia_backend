import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from 'src/auth/guard';
import { reportDto } from 'src/user/report.dto';

@Controller('reports')
export class ReportsController {
    constructor(private userService: ReportsService) {}

    @Post("view-user-reports")
    @UseGuards(JwtGuard)
    viewUserReports(@Request() req: any, @Body() body: { userID: number }) {
        return this.userService.viewUserReports(req,body);
    }
    
    @UseGuards(JwtGuard)
    @Post('upload-report')
    uploadReport(@Request() req, @Body() body : reportDto) {
    return this.userService.uploadReport(req,body );
    }
}
