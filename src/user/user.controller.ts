import { Body, Controller, Get, Patch, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}



  @Patch("update-user-data")
    @UseGuards(JwtGuard)
    updateUserData(@Request() req,@Body () body: {
        userID: number,
        firstName : string,
        lastName : string,
        password : string,
        role : string,
        institution : string}) {
        return this.userService.updateUserData(req,body);
        }

  @Post("view-users")
  @UseGuards(JwtGuard)
  viewUsers(@Request() req,@Body () body: { chooseRole : "ANY" | "USER" | "CLINICIAN" , ofClinicianID: number}) {
  return this.userService.viewUsers(req,body);
      }
}