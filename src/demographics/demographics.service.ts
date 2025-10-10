import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DemographicsService {
    constructor(private prisma: PrismaService) {}


    async createDemographicData(req, body) {
    const role = req.user.role;
    
    try {
        if (role === "ADMIN") {
            try {
                await this.prisma.demographicData.create({
                    data: {
                        userID: body.userID,
                        yearOfBirth: body.yearOfBirth,
                        gender: body.gender
                    }
                });
                return { message: "Success" };
            } catch (error) {
                if (error.code === "P2002") {
                    return { message: "Demographics already exist" };
                }
                else return { message: `${error}` };
            }
        }

        if (role === "USER") {
            try {
                await this.prisma.demographicData.create({
                    data: {
                        userID: req.user.userID,
                        yearOfBirth: body.yearOfBirth,
                        gender: body.gender
                    }
                });
                return { message: "Success" };
            } catch (error) {
                if (error.code === "P2002") {
                    return { message: "Demographics already exist" };
                }
                else return { message: `${error}` };
            }
        } else {
            return { message: "Unauthorized to create Demographics for this userID" };
        }
    } catch (error: any) {
        return { message: `${error}` };
    }
}


    async updateDemographicData(req, body) {
        const role = req.user.role;
        
        try {
            if (role === "ADMIN") {
                try {
                    await this.prisma.demographicData.update({
                        where: { userID: body.userID },
                        data: {
                            yearOfBirth: body.yearOfBirth,
                            gender: body.gender
                        }
                    });
                    return { message: "Success" };
                } catch (error) {
                    if (error.code === "P2005") {
                        return { message: "Demographics do not exist" };
                    }
                    else return { message: `${error}` };
                }
            }

            if (role === "USER") {
                try {
                    await this.prisma.demographicData.update({
                        where: { userID: req.user.userID },
                        data: {
                            yearOfBirth: body.yearOfBirth,
                            gender: body.gender
                        }
                    });
                    return { message: "Success" };
                } catch (error) {
                    if (error.code === "P2005") {
                        return { message: "Demographics do not exist" };
                    }
                    else return { message: `${error}` };
                }
            } else {
                return { message: "Unauthorized to update Demographics for this userID" };
            }
    }catch(error: any) {
        return { message: `${error}` };

    }
    }

    async viewDemographicData(req, body) {
        const role = req.user.role;
        try {
            if (role === "ADMIN") {
                const demographicData = await this.prisma.demographicData.findUnique({
                    where: { userID: body.userID }
                });
                return demographicData; //null if they do not exist
                } 

            if (role === "CLINICIAN") {
                const clinicianID = req.user.userID
                const patientID = body.userID
                const pair = await this.prisma.pairs.findFirst({
                where: {
                    clinicianID: clinicianID,
                    userID: patientID
                },
                });
                console.log(pair);
                if (pair) {
                const demographicData = await this.prisma.demographicData.findUnique({
                    where: { userID: body.userID }
                });
                if(demographicData===null){
                    return { message: "Demographics do not exist" };
                }else return demographicData;
                } else {
                return { message: "Unauthorized to view Demographics for this userID" };
                }
                                
            }

            if (role === "USER") {
                    const demographicData = await this.prisma.demographicData.findUnique({
                        where: { userID: req.user.userID }
                    });
                if(demographicData===null){
                    return { message: "Demographics do not exist" };
                }else return demographicData;
                } 
            else {
                return { message: "Unauthorized to view Demographics for this userID" };
            }

            
    }
    catch(error) {
        return { message: `${error}` };
    }
    }
}
