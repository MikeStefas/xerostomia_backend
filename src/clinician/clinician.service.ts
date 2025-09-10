import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicianService {
    constructor(private prisma : PrismaService) {
        
    }


    async pairClinician(req, clinicianID: number, patientID: number) {
        if(req.user.role !== "ADMIN") {
            return { message: "Unauthorized" }
        }
        try{
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
        catch(error){
            return ({message: "${error}"});
        }
}
}
