import { jenisKendaraan } from '@prisma/client';
import { IsNotEmpty, IsString, IsNumber, Min , IsEnum} from 'class-validator';


export class CreateParkirDto {

    @IsNotEmpty()
    @IsString()
    platNomor: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['roda2', 'roda4'])
    jenisKendaraan : jenisKendaraan;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    durasi : number;
}
