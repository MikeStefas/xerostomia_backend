import { IsInt, IsNotEmpty, IsString, Length, IsIn } from 'class-validator';

export class UserDataDto {
  @IsInt()
  @IsNotEmpty()
  userID: number;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMIN', 'PATIENT', 'CLINICIAN'], {
    message: 'Role must be one of: admin, user, clinician',
  })
  role: string;

  @IsString()
  @IsNotEmpty()
  institution: string;
}
