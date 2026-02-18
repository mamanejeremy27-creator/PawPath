import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  getSettings(@CurrentUser() user: User) {
    return this.settingsService.getSettings(user.id);
  }

  @Patch()
  updateSettings(@CurrentUser() user: User, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(user.id, dto);
  }
}
