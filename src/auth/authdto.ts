import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class AuthDto {
    @IsEmail()
    email : string;
    @IsString()
    password : string;


}