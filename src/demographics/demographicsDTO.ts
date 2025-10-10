import { IsInt, IsNotEmpty, IsString, Min, Max, IsIn } from 'class-validator';

export class DemographicsDto {
    @IsInt()
    @IsNotEmpty()
    userID: number;

    @IsInt()
    @Min(1900, { message: 'yearOfBirth must be no earlier than 1900' })
    @Max(2026, { message: 'yearOfBirth must be no later than 2026' }) 
    yearOfBirth: number;

    @IsString()
    @IsNotEmpty()
    @IsIn(['male', 'female', 'missing'], {
    message: 'gender must be one of: male, female, or other',
    })
    gender: string;
}