import { IsString, IsOptional, IsNumber, IsArray, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class JournalDataDto {
  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsString()
  @IsOptional()
  mood?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class CompleteExerciseDto {
  @IsString()
  dogId: string;

  @IsString()
  exerciseId: string;

  @IsString()
  levelId: string;

  @IsString()
  programId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => JournalDataDto)
  journal?: JournalDataDto;
}
