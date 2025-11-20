import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class FindParkirDto {
  @IsOptional()
  @IsString()
  search?: string; 

  @IsOptional()
  @IsString()
  jenisKendaraan?: string; 

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  startDate?: string; 

  @IsOptional()
  @IsString()
  endDate?: string; 
}
