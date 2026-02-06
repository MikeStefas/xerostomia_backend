import { IsString, IsInt } from 'class-validator';

export class reportDto {
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
  pain: string;

  @IsInt()
  painPercentage: number;
}
