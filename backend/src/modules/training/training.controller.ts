import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { TrainingService } from './training.service';
import type { CompleteExerciseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('training')
export class TrainingController {
  constructor(private trainingService: TrainingService) {}

  @Post('complete-exercise')
  completeExercise(@CurrentUser() user: User, @Body() dto: CompleteExerciseDto) {
    return this.trainingService.completeExercise(user.id, dto);
  }

  @Get('progress/:dogId')
  getProgress(@Param('dogId') dogId: string, @CurrentUser() user: User) {
    return this.trainingService.getProgress(dogId, user.id);
  }

  @Get('skill-health/:dogId')
  getSkillHealth(@Param('dogId') dogId: string, @CurrentUser() user: User) {
    return this.trainingService.getSkillHealth(dogId, user.id);
  }
}
