import { Injectable } from '@nestjs/common';
import { reportDto } from './report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDataDto } from './userdata.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    

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
            pain : body.pain,
            painPercentage : body.painPercentage,
        }        
    })
}
    async uploadUserData(user: any,body: UserDataDto) {
        await this.prisma.demographicData.create({
            data: {
            userID: user.userID,
            yearOfBirth : body.yearOfBirth,
            gender : body.gender,
        }        
    })
    }

    async getUserData(user:any) {
        const data = await this.prisma.demographicData.findFirst(
            {
                where: {userID : user.userID}
            }
        )
        return data;
    }

    async getReports(user:any) {
        const reports = await this.prisma.report.findMany(
            {
                where: {userID : user.userID}
            }
        )
        return reports;
    }

    async getRole(user:any) {
        const result = await this.prisma.user.findFirst(
            {
                where: {userID : user.userID}
            }
        )
        return {role : result?.role};
    }
}