import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DoesXExist } from 'src/methods/DoesXExist';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class DemographicsService {
  constructor(
    private prisma: PrismaService,
    private doesXExist: DoesXExist,
  ) {}

  async createDemographicData(
    requesterID: number,
    requesterRole: Role,
    body: { userID: number; yearOfBirth: number; gender: string },
  ) {
    try {
      switch (requesterRole) {
        case Role.ADMIN: {
          //check if user is a patient
          if ((await this.doesXExist.doesPatientExist(body.userID)) === false)
            throw new NotFoundException('User is not a patient');

          try {
            await this.prisma.demographicData.create({
              data: {
                userID: body.userID,
                yearOfBirth: body.yearOfBirth,
                gender: body.gender,
              },
            });
            return { message: 'Success' };
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === 'P2002'
            ) {
              throw new ConflictException('Demographics already exist');
            } else {
              throw error;
            }
          }
        }

        case Role.PATIENT: {
          try {
            await this.prisma.demographicData.create({
              data: {
                userID: requesterID,
                yearOfBirth: body.yearOfBirth,
                gender: body.gender,
              },
            });
            return { message: 'Success' };
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === 'P2002'
            ) {
              throw new ConflictException('Demographics already exist');
            } else {
              throw error;
            }
          }
        }

        default: {
          throw new ForbiddenException(
            'Unauthorized to create Demographics for this userID',
          );
        }
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ConflictException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async updateDemographicData(
    requesterID: number,
    requesterRole: Role,
    body: { userID: number; yearOfBirth: number; gender: string },
  ) {
    try {
      switch (requesterRole) {
        case Role.ADMIN: {
          try {
            await this.prisma.demographicData.update({
              where: { userID: body.userID },
              data: {
                yearOfBirth: body.yearOfBirth,
                gender: body.gender,
              },
            });
            return { message: 'Success' };
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === 'P2005'
            ) {
              throw new NotFoundException('Demographics do not exist');
            } else {
              throw error;
            }
          }
        }

        case Role.PATIENT: {
          try {
            await this.prisma.demographicData.update({
              where: { userID: requesterID },
              data: {
                yearOfBirth: body.yearOfBirth,
                gender: body.gender,
              },
            });
            return { message: 'Success' };
          } catch (error) {
            if (
              error instanceof Prisma.PrismaClientKnownRequestError &&
              error.code === 'P2005'
            ) {
              throw new NotFoundException('Demographics do not exist');
            } else {
              throw error;
            }
          }
        }

        default: {
          throw new ForbiddenException(
            'Unauthorized to update Demographics for this userID',
          );
        }
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }

  async viewDemographicData(
    requesterID: number,
    requesterRole: Role,
    body: { userID: number },
  ) {
    try {
      switch (requesterRole) {
        case Role.ADMIN: {
          const demographicData = await this.prisma.demographicData.findUnique({
            where: { userID: body.userID },
          });
          return demographicData; //null if they do not exist
        }

        case Role.CLINICIAN: {
          const clinicianID = requesterID;
          const patientID = body.userID;
          const pair = await this.prisma.pairs.findFirst({
            where: {
              clinicianID: clinicianID,
              patientID: patientID,
            },
          });

          if (pair) {
            const demographicData =
              await this.prisma.demographicData.findUnique({
                where: { userID: body.userID },
              });
            if (demographicData === null) {
              throw new NotFoundException('Demographics do not exist');
            } else return demographicData;
          } else {
            throw new ForbiddenException(
              'Unauthorized to view Demographics for this userID',
            );
          }
        }

        case Role.PATIENT: {
          const demographicData = await this.prisma.demographicData.findUnique({
            where: { userID: requesterID },
          });
          if (demographicData === null) {
            throw new NotFoundException('Demographics do not exist');
          } else return demographicData;
        }

        default: {
          throw new ForbiddenException(
            'Unauthorized to view Demographics for this userID',
          );
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }
}
