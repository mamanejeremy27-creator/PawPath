import { IsString, IsOptional, IsNumber, IsDateString, IsArray } from 'class-validator';

export class CreateWalkDto {
  @IsString()
  dogId: string;

  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsArray()
  route?: Array<{ lat: number; lng: number }>;

  @IsOptional()
  @IsString()
  notes?: string;
}
