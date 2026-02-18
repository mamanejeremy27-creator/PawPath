import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateSightingDto {
  @IsOptional()
  @IsObject()
  location?: { lat: number; lng: number; address?: string };

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
