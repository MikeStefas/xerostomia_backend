import { IsInt, IsString } from "class-validator";

export class UserDataDto {
  @IsInt()
  yearOfBirth: number;

  @IsString()
  gender: string;
}
