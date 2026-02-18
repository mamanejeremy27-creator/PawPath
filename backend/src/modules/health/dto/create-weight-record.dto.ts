import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateWeightRecordDto {
  @IsString()
  dogId: string;

  @IsNumber()
  weight: number;

  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
