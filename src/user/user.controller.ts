import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { reportDto } from './report.dto';
import { UserDataDto } from './userdata.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}



  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({whitelist: true}))
  @Post('upload-user-data')
  uploadUserData(@Request() req, @Body() body : UserDataDto) {
    return this.userService.uploadUserData(req.user,body );
  }

  @UseGuards(JwtGuard)
  @Get('get-user-data')
  getUserData(@Request() req) {
    return this.userService.getUserData(req.user);
  }
  
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('upload-report')
  uploadReport(@Request() req, @Body() body : reportDto) {
    return this.userService.uploadReport(req.user,body );
  }

  @UseGuards(JwtGuard)
  @Get('get-reports')
  getReports(@Request() req) {
    return this.userService.getReports(req.user);
  }

  @UseGuards(JwtGuard)
  @Get('get-role')
  getRole(@Request() req) {
    return this.userService.getRole(req.user);
  }

}