import {
  Controller, Get, Post, Patch, Body, Param, UseGuards,
} from '@nestjs/common';
import { LostDogsService } from './lost-dogs.service';
import {
  CreateLostDogReportDto,
  UpdateLostDogReportDto,
  CreateSightingDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@Controller('lost-dogs')
export class LostDogsController {
  constructor(private lostDogsService: LostDogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserReports(@CurrentUser() user: User) {
    return this.lostDogsService.getUserReports(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createReport(@CurrentUser() user: User, @Body() dto: CreateLostDogReportDto) {
    return this.lostDogsService.createReport(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateReport(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateLostDogReportDto,
  ) {
    return this.lostDogsService.updateReport(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/sightings')
  addSighting(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateSightingDto,
  ) {
    return this.lostDogsService.addSighting(id, user.id, dto);
  }

  // Public endpoint — no auth required
  @Get('public/:shareToken')
  getPublicReport(@Param('shareToken') shareToken: string) {
    return this.lostDogsService.getPublicReport(shareToken);
  }
}
