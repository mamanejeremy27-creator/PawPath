import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateDogDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsDateString()
  @IsOptional()
  birthday?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  avatar?: string;
}
