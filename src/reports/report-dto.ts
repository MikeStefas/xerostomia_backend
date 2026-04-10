import { IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class reportDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  result?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  userID?: number;
}
