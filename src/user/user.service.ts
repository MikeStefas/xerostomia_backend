import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { UserDataDto } from './userDataDTO';
import { BasicUserInfo } from 'src/auth/authdto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUserData(req: BasicUserInfo, body: UserDataDto) {
    try {
      const role = req.user.role;
      if (role !== 'ADMIN') {
        return { message: 'You do not have permission for this action' };
      }

      if (body.password.length < 8 && body.password !== '****') {
        return { message: 'Password must be at least 8 characters long' };
      }

      //find if user exists
      const user = await this.prisma.user.findUnique({
        where: { userID: body.userID },
      });
      if (user === null) {
        return { message: 'User does not exist' };
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
      if (error instanceof Error) return { message: error.message };
      return { message: `${error}` };
    }
  }

  async viewUsers(
    req: BasicUserInfo,
    body: {
      chooseRole: 'ANY' | 'PATIENT' | 'CLINICIAN' | null;
      ofClinicianID: number | null;
    },
  ) {
    const role = req.user.role;
    const chooseRole = body.chooseRole || null;
    const clinicianID = body.ofClinicianID || null;

    try {
      //view all users based on role (or any)
      if (role === 'ADMIN' && chooseRole !== null && clinicianID === null) {
        if (chooseRole === 'ANY') {
          //return ANY user
          const res = await this.prisma.user.findMany({
            where: { role: { in: ['PATIENT', 'CLINICIAN'] } },
          });
          return res.map((user) => ({ ...user, password: '****' })); //hide password
        } else {
          //return based on role. For example "PATIENT"
          const res = await this.prisma.user.findMany({
            where: { role: chooseRole },
          });
          return res.map((user) => ({ ...user, password: '****' }));
        }
      }
      //View usrers paired to a specific clinician as an admin
      //Provide clicianID to view
      else if (
        role === 'ADMIN' &&
        chooseRole === null &&
        clinicianID !== null
      ) {
        const pairedUsersEntries = await this.prisma.pairs.findMany({
          where: { clinicianID: clinicianID },
        });
        const pairedUserIDList = pairedUsersEntries.map(
          (entry) => entry.patientID,
        );
        const res = await this.prisma.user.findMany({
          where: { userID: { in: pairedUserIDList } },
        });
        return res.map((user) => ({ ...user, password: '****' }));
      }
      //View all users paired to the clinician, as the clinician himself
      else if (role === 'CLINICIAN') {
        const pairedUsersEntries = await this.prisma.pairs.findMany({
          where: { clinicianID: req.user.userID },
        });
        const pairedUserIDList = pairedUsersEntries.map(
          (entry) => entry.patientID,
        );
        const res = await this.prisma.user.findMany({
          where: { userID: { in: pairedUserIDList } },
        });
        return res.map((user) => ({ ...user, password: '****' }));
      } else {
        return { message: 'You do not have permission for this action' };
      }
    } catch (error) {
      if (error instanceof Error) return { message: error.message };
      return { message: `${error}` };
    }
  }
}
