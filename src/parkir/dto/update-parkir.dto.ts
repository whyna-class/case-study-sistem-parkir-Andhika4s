import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';


export class UpdateParkirDto {
    
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    durasi : number;
}
