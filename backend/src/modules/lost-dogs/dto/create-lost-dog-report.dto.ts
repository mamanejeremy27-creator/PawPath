import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateLostDogReportDto {
  @IsString()
  dogName: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  lastSeenLocation?: { lat: number; lng: number; address?: string };

  @IsOptional()
  @IsString()
  lastSeenDate?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  contactInfo?: string;
}
