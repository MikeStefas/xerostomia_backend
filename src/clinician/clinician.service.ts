import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicianService {
    constructor(private prisma : PrismaService) {
        
    }

    async viewReports(req) {
        const clinicianID = req.user.userID;
        const patients = await this.prisma.pairs.findMany({
            where: {
                clinicianID: clinicianID
            },
            select: {
                userID: true,
            }
        });    
        const patientIDs = patients.map(patient => patient.userID);
        let allReports : any[] = [];
        for (let patientID of patientIDs) {
            let reports = await this.prisma.report.findMany({
                where: {
                    userID: patientID
                },
                select: {
                    userID: true,
                    email: true,
                    tongue: true,
                    tonguePercentage: true,
                    teeth: true,
                    teethPercentage: true,
                    saliva: true,
                    salivaPercentage: true,
                    pain: true,
                    painPercentage: true,
                    createdAt: true,    
                }
            });
            allReports.push(reports[0]);
        }
        return allReports;
    }

    async viewUsers(req) {
        console.log(req.user);
        const clinicianID = req.user.userID;
        const patients = await this.prisma.pairs.findMany({
            where: {
                clinicianID: clinicianID
            },
            select: {
                userID: true,
            }
        });    
        const patientIDs = patients.map(patient => patient.userID);
        let allPatients : any[] = [];
        for (let patientID of patientIDs) {
            let user = await this.prisma.user.findMany({
                where: {
                    userID: patientID
                },
                select: {
                    userID: true,
                    email: true,
                    firstName: true,
                    lastName: true,  
                        }
            });

            allPatients.push(user[0]);
        }
        return allPatients;
    }

    async viewUserData(userID) {
        let data = await this.prisma.demographicData.findFirst({where: {userID: userID}});
        return data;

        
    }

    async viewUserReports(userID){
        let reports = await this.prisma.report.findMany({where: {userID: userID}});
        return reports;
    }
}
