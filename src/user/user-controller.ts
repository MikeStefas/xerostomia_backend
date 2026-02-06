import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from 'guard';
import { UserService } from './user-service';
import { UserDataDto } from './user-data-dto';
import { BasicUserInfo } from 'src/auth/auth-dto';
import { Role } from 'src/enums/role-enum';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('update-user-data')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateUserData(@Request() req: BasicUserInfo, @Body() body: UserDataDto) {
    return this.userService.updateUserData(
      req.user.userID,
      req.user.role as Role,
      body,
    );
  }

  @Get('view-users/:chooseRole/:ofClinicianID')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  viewUsers(
    @Request() req: BasicUserInfo,
    @Param('chooseRole') chooseRole: 'ANY' | 'PATIENT' | 'CLINICIAN',
    @Param('ofClinicianID') ofClinicianID: number,
  ) {
    return this.userService.viewUsers(
      req.user.userID,
      req.user.role as Role,
      chooseRole,
      ofClinicianID,
    );
  }
}
