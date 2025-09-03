import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { SignUpDto } from 'src/auth/authdto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) {}

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

    async viewPatientsOfClinician(clinicianID) {
        const patients = await this.prisma.pairs.findMany({
            where: {
                clinicianID: clinicianID
            },
            select: {
                userID: true,
            }
        });
        let userList: any[] = [];
        for (let patient of patients) {
            let user = await this.prisma.user.findUnique({where: {userID: patient.userID}});
            if (user!== null) {
                userList.push(user);
            }
        }
        return userList;
}

    async viewClinicians() {
    return await this.prisma.user.findMany({
        where: {
            role: 'CLINICIAN'
        },
        select: {
            userID: true,
            email: true,
            firstName: true,
            lastName: true,
            institution: true,
        }
    });
}

    async viewUserData(userID) {
        let data = await this.prisma.demographicData.findFirst({where: {userID: userID}});
        return data;

        
    }

    async viewUserReports(userID){
        let reports = await this.prisma.report.findMany({where: {userID: userID}});
        return reports;
    }

    async setClinician(clinician_email) {
        if(await this.prisma.user.findUnique({where: {email: clinician_email}}) == null) {
            return {message: "User does not exist"}
        }
        await this.prisma.user.update({
            where: {
                email: clinician_email
            },
            data: {
                role: 'CLINICIAN'
            }
        })
        return {message: "User is now a clinician"};
    }

    async pairClinician(clinicianID: number, patientID: number) {
        // check if the pair already exists
        const existingPair = await this.prisma.pairs.findFirst({
            where: {
            clinicianID: clinicianID,
            userID: patientID,
            },
        });

        if (existingPair) {
            return { message: "Already paired" };
        }

        // create the pair if it doesn't exist
        await this.prisma.pairs.create({
            data: {
            clinicianID: clinicianID,
            userID: patientID,
            },
        });

        return { message: "Users are now paired" };
        }

    async pairDb() {
        let pairDB = await this.prisma.pairs.findMany();
        let emailDb : object[] = [];
        for(let i in pairDB) {
            let user = await this.prisma.user.findUnique({where: {userID: pairDB[i].userID}});
            let clinician = await this.prisma.user.findUnique({where: {userID: pairDB[i].clinicianID}});
            emailDb.push({
                userEmail: user?.email,
                clinicianEmail: clinician?.email
            });
        
        }
        return emailDb;
    }


    async createUser(body: SignUpDto) {
        const hashedPassword = await argon2.hash(body.password);

        if(await this.prisma.user.findUnique({where: {email: body.email}}) != null) {
            return {message: "User already exists"};
        }

        await this.prisma.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
            firstName: body.firstName,
            lastName: body.lastName,
            role: "USER",
          },
        });
        
        return {message : "successful"};
      }

      async viewUsers(role) {
        if(role == "USER") {
            const result = await this.prisma.user.findMany({where: {role: "USER"}});
            result.map((user) => {
                user.password = "-";
            })
            return result;
        }
        else if(role == "CLINICIAN") {
            const result = await this.prisma.user.findMany({where: {role: "CLINICIAN"}});
            result.map((user) => {
                user.password = "-";
            })
            return result;
        }
        else if (role == "ANY" ) {
            const result = await this.prisma.user.findMany({
                where: {
                    OR: [
                        {role: "USER"},
                        {role: "CLINICIAN"}
                    ]
                }
            });
            result.map((user) => {
                user.password = "-";
            })
            return result;
        }
      }

      async updateUser(body) {
        if(await this.prisma.user.findUnique({where: {userID: body.userID}}) == null) {
            return {message: "User does not exist"};
        }
        const hashedPassword = await argon2.hash(body.password);
        await this.prisma.user.update({
            where: {
                userID: body.userID
            },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                password: hashedPassword,
                role: body.role,
                institution: body.institution
            }
        })
        return {message: "User updated successfully"};
      }

      async updateDemographics(body) {
        if(await this.prisma.demographicData.findUnique({where: {userID: body.userID}}) == null) {
            return {message: "Demographic Data do not exist"};
        }
        await this.prisma.demographicData.update({
            where: {
                userID: body.userID
            },
            data: {
                yearOfBirth: body.yearOfBirth,
                gender: body.gender
            }
        })
        return {message: "Demographics updated successfully"};
      }
    

    async createDemographics(body) {

        if(await this.prisma.demographicData.findUnique({where: {userID: body.userID}}) != null) {
            return {message: "Demographic Data already exist"};
        }

        await this.prisma.demographicData.create({
            data: {
                userID: body.userID,
                yearOfBirth: body.yearOfBirth,
                gender: body.gender
            }
        })
        return {message: "Demographics created successfully"};
    }
}
