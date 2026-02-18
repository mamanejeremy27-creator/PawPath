import { IsString, IsOptional } from 'class-validator';

export class CreateVaccinationDto {
  @IsString()
  dogId: string;

  @IsString()
  name: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  nextDue?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
