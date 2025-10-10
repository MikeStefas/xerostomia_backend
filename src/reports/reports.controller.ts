import { Body, Controller, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from 'guard';
import { reportDto } from 'src/reports/report.dto';

@Controller('reports')
export class ReportsController {
    constructor(private userService: ReportsService) {}

    @Post("view-user-reports")
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    viewUserReports(@Request() req: any, @Body() body: { userID: number }) {
        return this.userService.viewUserReports(req,body);
    }
    
    @UseGuards(JwtGuard)
    @Post('upload-report')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    uploadReport(@Request() req, @Body() body : reportDto) {
    return this.userService.uploadReport(req,body );
    }
}
