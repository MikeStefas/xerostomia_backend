import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { reportDto } from 'src/reports/report.dto';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) {}

    async viewUserReports(req,body){
        const role = req.user.role;

        if(role === "ADMIN") {
            let reports = await this.prisma.report.findMany({where: {userID: body.userID}});
            return reports;
        }
        
        if(role === "CLINICIAN")
            {
            const clinicianID = req.user.userID;
            const userID = body.userID;
            let pair = await this.prisma.pairs.findFirst({where: {clinicianID: clinicianID, userID: userID}});
            
            if(pair === null) {
                return {message: "Unauthorized to view reports of this userID"};
            }
            else {
            let reports = await this.prisma.report.findMany({where: {userID: userID}});
            return reports;
                }
        }

        if(role === "USER") {
            let reports = await this.prisma.report.findMany({where: {userID: req.user.userID}});
            return reports;
        }
    }

    async uploadReport(req,body) {
        const role = req.user.role;
        if(role !== "USER") {
            return {message: "You do not have permission to upload reports"};
        }

        await this.prisma.report.create({
            data: {
            userID: req.user.userID,
            email: req.user.email,
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
        return {message: "Success"};
    }
}
