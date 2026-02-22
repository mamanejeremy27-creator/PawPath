import { IsString, IsOptional, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsNumber()
  @Min(-90) @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180) @Max(180)
  lng: number;

  @IsOptional()
  @IsString()
  address?: string;
}

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
  @ValidateNested()
  @Type(() => LocationDto)
  lastSeenLocation?: LocationDto;

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
