import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user);
  }
}