import { Body, Controller, Get, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminJwtGuard } from './guard';
import { AdminService } from './admin.service';
import { SignUpDto } from 'src/auth/authdto';

@Controller('admin')
export class AdminController {
    constructor(private prisma: PrismaService, private adminService: AdminService) {}
    

    @Get("view-reports")
        @UseGuards(AdminJwtGuard)
        viewReports(@Request() req: any) {
    
            return this.adminService.viewReports(req);
        }
    
        @Post("view-patients-of-clinician")
        @UseGuards(AdminJwtGuard)
        viewPatientsOfClinician(@Body() req: { clinicianID: number }) {
    
            return this.adminService.viewPatientsOfClinician(req.clinicianID);
        }
        
        @Get("view-clinicians")
        @UseGuards(AdminJwtGuard)
        viewClinicians() {
    
            return this.adminService.viewClinicians();
        }

        @Post("view-user-data")
        @UseGuards(AdminJwtGuard)
        viewUserData(@Request() req: any, @Body() body: { userID: number }) {
            const userID = body.userID;
            return this.adminService.viewUserData(userID);
        }
    
        @Post("view-user-reports")
        @UseGuards(AdminJwtGuard)
        viewUserReports(@Request() req: any, @Body() body: { userID: number }) {
            const userID = body.userID;
            return this.adminService.viewUserReports(userID);
        } 
        
        @Post("set-clinician")
        @UseGuards(AdminJwtGuard)
        setClinician(@Body() body: { email: string }) {
            const clinician_email = body.email;
            return this.adminService.setClinician(clinician_email);
        }
        
        @Post("pair-clinician")
        @UseGuards(AdminJwtGuard)
        pairClinician(@Body() body: { clinicianID: number, patientID: number }) {
            const clinicianID = body.clinicianID;
            const patientID = body.patientID;
            return this.adminService.pairClinician(clinicianID, patientID);
        }
        
        @Get("pair-db")
        @UseGuards(AdminJwtGuard)
        supervisorDb() {
            return this.adminService.pairDb();
        }

        @Post('create-user')
        @UseGuards(AdminJwtGuard)
        signup(@Body() body: SignUpDto){
            return this.adminService.createUser(body);
        }


        @Post("view-users")
        @UseGuards(AdminJwtGuard)
        viewUsers(@Body () body: { role : string }) {
    
            return this.adminService.viewUsers(body.role);
        }
        
        @Patch("update-user")
        @UseGuards(AdminJwtGuard)
        updateUser(@Body () body: {
            userID: number,
            firstName : string,
            lastName : string,
            password : string,
            role : string,
            institution : string}) {
    
            return this.adminService.updateUser(body);
        }

        @Patch("update-demographics")
        @UseGuards(AdminJwtGuard)
        updateDemographics(@Body () body: {
            userID: number,
            yearOfBirth : number,
            gender : string
            }) {
    
            return this.adminService.updateDemographics(body);
        }
        

        @Post("create-demographics")
        @UseGuards(AdminJwtGuard)
        createDemographics(@Body () body: {
            userID: number,
            yearOfBirth : number,
            gender : string
            }) {
    
            return this.adminService.createDemographics(body);
    }
}
