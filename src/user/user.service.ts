import { Injectable } from '@nestjs/common';
import { reportDto } from '../reports/report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { User } from 'generated/prisma';

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

            if(body.password.length < 8 && body.password !== "****") {
                return {message: "Password must be at least 8 characters long"};
            }

            //find if user exists
            const user = await this.prisma.user.findUnique({where: {userID: body.userID}});
            if(user === null) {
                return {message: "User does not exist"};
            }

            //if password is **** do not update it!
            if(body.password !== "****") {
                const hashedPassword = await argon2.hash(body.password);
                body.password = hashedPassword;
            }else //do not change password
            {
                body.password = user.password;
            }


            await this.prisma.user.update({
                where: {
                    userID: body.userID
                },
                data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    password: body.password,
                    role: body.role,
                    institution: body.institution
                }
            })
            return {message: "Success"};
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
                    //return all that are not admins
                    let res = await this.prisma.user.findMany({where:{role: {in: ["USER","CLINICIAN"]}}}); 
                    return(res.map(user=> ({...user, password: "****" }))); //hide password
                }
                else{
                    //return based on role. For example "USER"
                    let res = await this.prisma.user.findMany({where: {role: chooseRole}});
                    return(res.map(user=> ({...user, password: "****" })));
                }
            }
            //View usrers paired to a specific clinician as an admin
            else if(role === "ADMIN" && chooseRole === null && clinicianID !== null)
            {
                let pairedUsersEntries = await this.prisma.pairs.findMany({where: {clinicianID: clinicianID}});
                let pairedUserIDList = pairedUsersEntries.map(entry => entry.userID);
                let res = await this.prisma.user.findMany({where: {userID: {in: pairedUserIDList}}});
                return(res.map(user=> ({...user, password: "****" })));
            }
            //View all users paired to the clinician, as the clinician himself
            else if(role === "CLINICIAN")
            {
                let pairedUsersEntries = await this.prisma.pairs.findMany({where: {clinicianID: req.user.userID}})
                let pairedUserIDList = pairedUsersEntries.map(entry => entry.userID);
                let res = await this.prisma.user.findMany({where: {userID: {in: pairedUserIDList}}});
                return(res.map(user=> ({...user, password: "****" })));
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
