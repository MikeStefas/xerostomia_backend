import { IsString, IsInt } from 'class-validator';

export class reportDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsInt()
  age: number;

  @IsString()
  gender: string;

  @IsString()
  tongue: string;

  @IsInt()
  tonguePercentage: number;

  @IsString()
  teeth: string;
  
  @IsInt()
  teethPercentage: number;

  @IsString()
  saliva: string;

  @IsInt()
  salivaPercentage: number;

  @IsString()
  painSolid: string;

  @IsString()
  painLiquid: string;

  @IsString()
  painMixed: string;

  @IsInt()
  painPercentage: number;
}