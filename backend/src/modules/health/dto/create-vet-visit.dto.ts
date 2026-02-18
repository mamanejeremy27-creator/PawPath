import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateVetVisitDto {
  @IsString()
  dogId: string;

  @IsString()
  date: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  vet?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;
}
