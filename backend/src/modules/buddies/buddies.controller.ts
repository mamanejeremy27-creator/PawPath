import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { BuddiesService } from './buddies.service';
import { SendBuddyRequestDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('buddies')
export class BuddiesController {
  constructor(private buddiesService: BuddiesService) {}

  @Get('candidates')
  findCandidates(@CurrentUser() user: User) {
    return this.buddiesService.findCandidates(user.id);
  }

  @Get()
  listBuddies(@CurrentUser() user: User) {
    return this.buddiesService.listBuddies(user.id);
  }

  @Post('request')
  sendRequest(@CurrentUser() user: User, @Body() dto: SendBuddyRequestDto) {
    return this.buddiesService.sendRequest(user.id, dto.toUserId);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @CurrentUser() user: User) {
    return this.buddiesService.accept(id, user.id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.buddiesService.reject(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.buddiesService.remove(id, user.id);
  }
}
