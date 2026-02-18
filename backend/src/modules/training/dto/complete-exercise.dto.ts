import { IsString, IsOptional, IsNumber, IsObject, Min, Max } from 'class-validator';

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
  @IsObject()
  journal?: JournalDataDto;
}
