import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './authdto';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {} //create an instance of AuthController


    @Post('signup')
    @UsePipes(new ValidationPipe({whitelist:true}))
    signup(@Body() body: AuthDto){
        return this.authService.signup(body);
    }

    @Delete('deleteacc')
    @UsePipes(new ValidationPipe({whitelist:true}))
    deleteacc(@Body() body: AuthDto){
        return this.authService.deleteacc(body);
    }

    @Get('signin')
    @UsePipes(new ValidationPipe({whitelist:true}))
    signin(@Body() body: AuthDto){
        return this.authService.signin(body);
    }


}
