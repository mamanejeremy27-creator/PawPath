import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get('weekly')
  getWeekly() {
    return this.leaderboardService.getWeekly();
  }

  @Get('all-time')
  getAllTime() {
    return this.leaderboardService.getAllTime();
  }

  @Get('breed/:breed')
  getByBreed(@Param('breed') breed: string) {
    return this.leaderboardService.getByBreed(breed);
  }
}
