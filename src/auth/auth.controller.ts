import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './authdto';
import { RefreshGuard } from './guard/refresh.guard';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {} //create an instance of AuthController


    @Post('signup')
    @UsePipes(new ValidationPipe({whitelist:true}))
    signup(@Body() body: SignUpDto){
        return this.authService.signup(body);
    }

    @Delete('deleteacc')
    @UsePipes(new ValidationPipe({whitelist:true}))
    deleteacc(@Body() body: SignInDto){
        return this.authService.deleteacc(body);
    }

    @Post('signin')
    @UsePipes(new ValidationPipe({whitelist:true}))
    signin(@Body() body: SignInDto){
        return this.authService.signin(body);
    }

    @Post('refresh')
    @UseGuards(RefreshGuard)
    @UsePipes(new ValidationPipe({whitelist:true}))
    refreshTokens(@Request() req) {
        return this.authService.refreshTokens(req.user.id, req.user.email, req.user.role);
    }


}
