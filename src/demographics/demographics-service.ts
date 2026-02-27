import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DoesXExist } from 'src/methods/does-x-exist';
import { PrismaService } from 'src/prisma/prisma-service';
import { Prisma } from '@prisma/client';
import { Role } from 'src/enums/role-enum';
import { DemographicsDto } from './demographics-dto';

@Injectable()
export class DemographicsService {
  constructor(
    private prisma: PrismaService,
    private doesXExist: DoesXExist,
  ) {}

  async createDemographicData(
    requesterID: number,
    requesterRole: Role,
    body: DemographicsDto,
  ) {
    try {
      const targetUserID =
        requesterRole === Role.PATIENT ? requesterID : body.userID;

      if (requesterRole === Role.ADMIN) {
        if (!(await this.doesXExist.doesPatientExist(targetUserID))) {
          throw new NotFoundException('User is not a patient');
        }
      } else if (requesterRole !== Role.PATIENT) {
        throw new ForbiddenException('Unauthorized to create demographics');
      }

      await this.prisma.demographicData.create({
        data: {
          userID: targetUserID,
          yearOfBirth: body.yearOfBirth,
          gender: body.gender,
        },
      });
      return { message: 'Success' };
    } catch (error) {
      this.handlePrismaError(error, 'Demographics already exist');
    }
  }

  async updateDemographicData(
    requesterID: number,
    requesterRole: Role,
    body: DemographicsDto,
  ) {
    try {
      const targetUserID =
        requesterRole === Role.PATIENT ? requesterID : body.userID;

      if (requesterRole !== Role.ADMIN && requesterRole !== Role.PATIENT) {
        throw new ForbiddenException('Unauthorized to update demographics');
      }

      await this.prisma.demographicData.update({
        where: { userID: targetUserID },
        data: {
          yearOfBirth: body.yearOfBirth,
          gender: body.gender,
        },
      });
      return { message: 'Success' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async viewDemographicData(
    requesterID: number,
    requesterRole: Role,
    body: { userID: number },
  ) {
    try {
      const targetUserID = body.userID;

      if (requesterRole === Role.ADMIN) {
        return await this.prisma.demographicData.findUnique({
          where: { userID: targetUserID },
        });
      }

      if (requesterRole === Role.PATIENT) {
        return this.getRequiredDemographics(requesterID);
      }

      if (requesterRole === Role.CLINICIAN) {
        const isPaired = await this.prisma.pairs.findFirst({
          where: { clinicianID: requesterID, patientID: targetUserID },
        });

        if (!isPaired) {
          throw new ForbiddenException(
            'Unauthorized to view these demographics',
          );
        }

        return this.getRequiredDemographics(targetUserID);
      }

      throw new ForbiddenException('Unauthorized role');
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException(`${error}`);
    }
  }

  private async getRequiredDemographics(userID: number) {
    const data = await this.prisma.demographicData.findUnique({
      where: { userID },
    });
    if (!data) throw new NotFoundException('Demographics do not exist');
    return data;
  }

  private handlePrismaError(error: any, conflictMessage = 'Conflict') {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') throw new ConflictException(conflictMessage);
      if (error.code === 'P2025' || error.code === 'P2005')
        throw new NotFoundException('Demographics do not exist');
    }
    if (
      error instanceof NotFoundException ||
      error instanceof ForbiddenException ||
      error instanceof ConflictException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(`${error}`);
  }
}
