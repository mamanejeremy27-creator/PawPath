import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettings } from '../../entities/user-settings.entity';
import type { UpdateSettingsDto } from './dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private settingsRepo: Repository<UserSettings>,
  ) {}

  async getSettings(userId: string): Promise<UserSettings> {
    let settings = await this.settingsRepo.findOne({ where: { userId } });
    if (!settings) {
      settings = this.settingsRepo.create({ userId });
      settings = await this.settingsRepo.save(settings);
    }
    return settings;
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto): Promise<UserSettings> {
    let settings = await this.getSettings(userId);

    // Map frontend field names to entity columns
    const mapped: Partial<UserSettings> = {};
    if (dto.language !== undefined) mapped.language = dto.language;
    if (dto.lang !== undefined) mapped.language = dto.lang;
    if (dto.theme !== undefined) mapped.theme = dto.theme;
    if (dto.activeTheme !== undefined) mapped.theme = dto.activeTheme;
    if (dto.reminders !== undefined) mapped.reminders = dto.reminders;
    if (dto.leaderboardOptIn !== undefined) mapped.leaderboardOptIn = dto.leaderboardOptIn;
    if (dto.unlockedThemes !== undefined) mapped.unlockedThemes = dto.unlockedThemes;
    if (dto.unlockedAccessories !== undefined) mapped.unlockedAccessories = dto.unlockedAccessories;
    if (dto.activeAccessory !== undefined) mapped.activeAccessory = dto.activeAccessory;
    if (dto.activeAccessories !== undefined) mapped.activeAccessory = dto.activeAccessories?.[0] || undefined;

    Object.assign(settings, mapped);
    return this.settingsRepo.save(settings);
  }
}
