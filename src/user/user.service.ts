import { Injectable } from '@nestjs/common';
import { reportDto } from './report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    

    
    async updateUserData(req,body) 
    {   
        try{
            const role = req.user.role;
            if(role !== "ADMIN") {
                return {message: "You do not have permission for this action"};
            }
            const user = await this.prisma.user.findUnique({where: {userID: body.userID}});
            if(user === null) {
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
        catch(error){
            return ({message: "${error}"});
        }
    }

    async viewUsers(req,body) {
        const role = req.user.role;
        const chooseRole = body.chooseRole || null;
        const clinicianID = body.ofClinicianID || null;

        try{
            //view all users based on role (or any)
            if(role === "ADMIN" && chooseRole !== null && clinicianID === null)
            {
                if(chooseRole === "ANY"){
                    return this.prisma.user.findMany({where:{role: {in: ["USER","CLINICIAN"]}}});
                }
                else{
                    return this.prisma.user.findMany({where: {role: chooseRole}});
                }
            }
            //View usrers of a specific clinician
            else if(role === "ADMIN" && chooseRole === null && clinicianID !== null)
            {
                return this.prisma.pairs.findMany({where: {clinicianID: clinicianID}});
            }

            else if(role === "CLINICIAN")
            {
                return this.prisma.pairs.findMany({where: {clinicianID: req.user.userID}});
            }
            else
            {
                return {message: "You do not have permission for this action"};
            }
        }
        catch(error){
            return ({message: "${error}"});
        }
    }
}
