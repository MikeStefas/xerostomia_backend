import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminJwtGuard } from './guard';

@Controller('admin')
export class AdminController {
    constructor(private prisma: PrismaService) {}
    
    
    @UseGuards(AdminJwtGuard)
    @Get("db")
    async getDb(@Request() req) {
        return await this.prisma.user.findMany();;
    }
    


    }

