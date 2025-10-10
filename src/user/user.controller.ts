import { Body, Controller, Get, Patch, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from 'guard';
import { UserService } from './user.service';
import { UserDataDto } from './userDataDTO';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}



  @Patch("update-user-data")
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe({whitelist: true}))
    updateUserData(@Request() req,@Body () body: UserDataDto) {
        return this.userService.updateUserData(req,body);
        }

  @Post("view-users")
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({whitelist: true}))
  viewUsers(@Request() req,@Body () body: { chooseRole : "ANY" | "USER" | "CLINICIAN" , ofClinicianID: number}) {
  return this.userService.viewUsers(req,body);
      }
}