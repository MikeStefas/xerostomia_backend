import { IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class reportDto {
  @IsString()
  tongue: string;

  @IsInt()
  @Type(() => Number)
  tonguePercentage: number;

  @IsString()
  teeth: string;

  @IsInt()
  @Type(() => Number)
  teethPercentage: number;

  @IsString()
  saliva: string;

  @IsInt()
  @Type(() => Number)
  salivaPercentage: number;

  @IsString()
  pain: string;

  @IsInt()
  @Type(() => Number)
  painPercentage: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  userID?: number;
}
