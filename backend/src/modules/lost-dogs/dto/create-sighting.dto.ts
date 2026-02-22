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

export class CreateSightingDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
