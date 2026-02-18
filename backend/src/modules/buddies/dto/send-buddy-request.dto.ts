import { IsString } from 'class-validator';

export class SendBuddyRequestDto {
  @IsString()
  toUserId: string;
}
