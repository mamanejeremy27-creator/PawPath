import { IsString, IsIn } from 'class-validator';

export class SpeakDto {
  @IsString()
  text: string;

  @IsIn(['en', 'he'])
  lang: 'en' | 'he';
}
