import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma-service';
import * as argon2 from 'argon2';
import { UserDataDto } from './user-data-dto';
import { Role } from 'src/enums/role-enum';
import { formatUserResponse } from 'src/methods/format-user';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUserData(
    requesterRole: Role,
    body: UserDataDto,
  ) {
    try {
      if (requesterRole !== Role.ADMIN) {
        throw new ForbiddenException(
          'You do not have permission for this action',
        );
      }

      if (body.password.length < 8 && body.password !== '****') {
        throw new BadRequestException(
          'Password must be at least 8 characters long',
        );
      }

      //find  user
      const user = await this.prisma.user.findUnique({
        where: { userID: body.userID },
      });
      if (user === null) {
        throw new NotFoundException('User does not exist');
      }

      //if password is **** do not update it!
      if (body.password !== '****') {
        const hashedPassword = await argon2.hash(body.password);
        body.password = hashedPassword;
      } //do not change password
      else {
        body.password = user.password;
      }

      await this.prisma.user.update({
        where: {
          userID: body.userID,
        },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          password: body.password,
          role: body.role,
          institution: body.institution,
        },
      });
      return { message: 'Success' };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async viewUsers(
    requesterID: number,
    requesterRole: Role,
    chooseRole: 'ANY' | 'PATIENT' | 'CLINICIAN' | null,
    ofClinicianID: number | null,
  ) {
    if (typeof ofClinicianID === 'string'){
      ofClinicianID = parseInt(ofClinicianID);
    }
    try {
      if (requesterRole === Role.ADMIN) {
        if (ofClinicianID !== null && !isNaN(ofClinicianID)) {
          return this.getPatientsForClinician(ofClinicianID);
        }
        if (chooseRole !== null) {
          return this.getAllUsersByRole(chooseRole);
        }
        return [];
      }

      if (requesterRole === Role.CLINICIAN) {
        return this.getPatientsForClinician(requesterID);
      }

      throw new ForbiddenException(
        'You do not have permission for this action',
      );
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }

  private async getPatientsForClinician(clinicianID: number) {
    const pairedUsersEntries = await this.prisma.pairs.findMany({
      where: { clinicianID },
    });

    const pairedUserIDList = pairedUsersEntries.map((entry) => entry.patientID);

    const users = await this.prisma.user.findMany({
      where: { userID: { in: pairedUserIDList } },
      include: { _count: { select: { reports: true } } },
    });

    return users.map((user) => formatUserResponse(user));
  }

  private async getAllUsersByRole(chooseRole: 'ANY' | 'PATIENT' | 'CLINICIAN') {
    const roleFilter =
      chooseRole === 'ANY'
        ? { in: [Role.PATIENT, Role.CLINICIAN] }
        : chooseRole;

    const users = await this.prisma.user.findMany({
      where: { role: roleFilter },
      include: { _count: { select: { reports: true } } },
    });

    return users.map((user) => formatUserResponse(user));
  }
}
