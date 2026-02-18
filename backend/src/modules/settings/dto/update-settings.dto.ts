import { IsOptional, IsString, IsBoolean, IsObject, IsArray } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsObject()
  reminders?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  leaderboardOptIn?: boolean;

  @IsOptional()
  @IsArray()
  unlockedThemes?: string[];

  @IsOptional()
  @IsArray()
  unlockedAccessories?: string[];

  @IsOptional()
  @IsString()
  activeAccessory?: string;
}
