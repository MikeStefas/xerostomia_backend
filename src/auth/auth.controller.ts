import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './authdto';
import { RefreshGuard } from '../../guard/refresh.guard';
import { AdminJwtGuard } from 'guard/admin.guard';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {} //create an instance of AuthController

    @UseGuards(AdminJwtGuard)
    @Post('create-user')
    @UsePipes(new ValidationPipe({whitelist:true}))
    createUser(@Body() body: SignUpDto){
        return this.authService.createUser(body);
    }


    @Post('signin')
    @UsePipes(new ValidationPipe({whitelist:true}))
    signin(@Body() body: SignInDto){
        return this.authService.signin(body);
    }

    @UseGuards(RefreshGuard)
    @Get('refresh')
    @UseGuards(RefreshGuard)
    @UsePipes(new ValidationPipe({whitelist:true}))
    refreshTokens(@Request() req) {
        console.log(req);
        return this.authService.refreshTokens(req.user.userID, req.user.email, req.user.role);
    }


}
