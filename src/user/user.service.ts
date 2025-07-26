import { Injectable } from '@nestjs/common';
import { reportDto } from './report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDataDto } from './userdata.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    getProfile(user: any) {
        return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
        
        };}

    async uploadReport(user: any,body: reportDto) {
     await this.prisma.report.create({
            data: {
            userID: user.userID,
            email: user.email,
            tongue : body.tongue,
            tonguePercentage : body.tonguePercentage,
            teeth : body.teeth,
            teethPercentage : body.teethPercentage,
            saliva : body.saliva,
            salivaPercentage : body.salivaPercentage,
            painSolid : body.painSolid,
            painLiquid : body.painLiquid,
            painMixed : body.painMixed,
            painPercentage : body.painPercentage,
        }        
    })
}
    async uploadUserData(user: any,body: UserDataDto) {
        await this.prisma.userData.create({
            data: {
            userID: user.userID,
            yearOfBirth : body.yearOfBirth,
            gender : body.gender,
        }        
    })
    }
}