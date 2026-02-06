import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { UserDataDto } from './userDataDTO';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUserData(
    requesterID: number,
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

      //find if user exists
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
    if (typeof ofClinicianID === 'string') {
      ofClinicianID = null;
    }
    try {
      switch (requesterRole) {
        case Role.ADMIN: {
          //view simple roles
          if (chooseRole === 'ANY' && ofClinicianID === null) {
            const res = await this.prisma.user.findMany({
              where: { role: { in: [Role.PATIENT, Role.CLINICIAN] } },
            });
            return res.map((user) => ({ ...user, password: '****' }));
          } else if (chooseRole !== null && ofClinicianID === null) {
            const res = await this.prisma.user.findMany({
              where: { role: chooseRole },
            });
            return res.map((user) => ({ ...user, password: '****' }));
          }
          //View users paired to a specific clinician as an admin
          if (chooseRole === null && ofClinicianID !== null) {
            const pairedUsersEntries = await this.prisma.pairs.findMany({
              where: { clinicianID: ofClinicianID },
            });
            const pairedUserIDList = pairedUsersEntries.map(
              (entry) => entry.patientID,
            );
            const res = await this.prisma.user.findMany({
              where: { userID: { in: pairedUserIDList } },
            });
            return res.map((user) => ({ ...user, password: '****' }));
          } else {
            // Default case for admin (maybe return all or nothing)
            // Just preserving logical flow, but could be a bad request
            return [];
          }
        }

        case Role.CLINICIAN: {
          const pairedUsersEntries = await this.prisma.pairs.findMany({
            where: { clinicianID: requesterID },
          });
          const pairedUserIDList = pairedUsersEntries.map(
            (entry) => entry.patientID,
          );
          const res = await this.prisma.user.findMany({
            where: { userID: { in: pairedUserIDList } },
          });
          return res.map((user) => ({ ...user, password: '****' }));
        }

        default: {
          throw new ForbiddenException(
            'You do not have permission for this action',
          );
        }
      }
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
