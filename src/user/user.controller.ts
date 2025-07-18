import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { reportDto } from './report.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user);
  }
  
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('upload-report')
  uploadReport(@Request() req, @Body() body : reportDto) {
    return this.userService.uploadReport(req.user,body );
  }
}