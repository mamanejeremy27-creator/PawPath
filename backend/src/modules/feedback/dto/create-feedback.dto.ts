import { IsString, IsOptional, IsInt, IsObject } from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  rating?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
