import { IsString, IsOptional, IsObject, Allow } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  postType?: string;

  @IsOptional()
  @IsString()
  dogId?: string;

  @IsOptional()
  @IsString()
  dogName?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @Allow()
  badgeId?: string | null;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
