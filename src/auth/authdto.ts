import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 128, { message: 'Password must be at least 8 characters long' })
  password: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  role: string;
  @IsString()
  institution: string;
}

export class SignInDto {
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 128, { message: 'Password must be at least 8 characters long' })
  password: string;
}
