import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from 'guard';
import { PrismaService } from 'src/prisma/prisma-service';
import { DemographicsService } from './demographics-service';
import { DemographicsDto } from './demographics-dto';
import { BasicUserInfo } from 'src/auth/auth-dto';
import { Role } from 'src/enums/role-enum';

@Controller('demographics')
export class DemographicsController {
  constructor(
    private prisma: PrismaService,
    private demographicsService: DemographicsService,
  ) {}

  @Post('create-demographic-data')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createDemographicData(
    @Request() req: BasicUserInfo,
    @Body() body: DemographicsDto,
  ) {
    return this.demographicsService.createDemographicData(
      req.user.userID,
      req.user.role as Role,
      body,
    );
  }

  @Patch('update-demographic-data')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateDemographics(
    @Request() req: BasicUserInfo,
    @Body() body: DemographicsDto,
  ) {
    return this.demographicsService.updateDemographicData(
      req.user.userID,
      req.user.role as Role,
      body,
    );
  }

  @Post('view-demographic-data')
  @UseGuards(JwtGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  viewDemographicData(
    @Request() req: BasicUserInfo,
    @Body() body: { userID: number },
  ) {
    return this.demographicsService.viewDemographicData(
      req.user.userID,
      req.user.role as Role,
      body,
    );
  }
}
