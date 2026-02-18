import {
  Controller, Get, Post, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { WalksService } from './walks.service';
import type { CreateWalkDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('walks')
export class WalksController {
  constructor(private walksService: WalksService) {}

  @Get(':dogId')
  findByDog(@Param('dogId') dogId: string, @CurrentUser() user: User) {
    return this.walksService.findByDog(dogId, user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateWalkDto) {
    return this.walksService.create(user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.walksService.remove(id, user.id);
  }
}
