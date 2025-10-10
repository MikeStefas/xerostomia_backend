import { IsInt, IsNotEmpty } from 'class-validator';

export class PairClinicianDto {
    @IsInt()
    @IsNotEmpty()
    clinicianID: number;

    @IsInt()
    @IsNotEmpty()
    patientID: number;
}