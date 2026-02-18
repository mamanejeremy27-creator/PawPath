import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsService } from './settings.service';
import { UserSettings } from '../../entities/user-settings.entity';

describe('SettingsService', () => {
  let service: SettingsService;
  let settingsRepo: jest.Mocked<Partial<Repository<UserSettings>>>;

  const userId = 'user-1';

  const mockSettings: UserSettings = {
    id: 'settings-1',
    userId,
    user: undefined,
    language: 'en',
    theme: 'default',
    reminders: { enabled: false, times: ['09:00', '18:00'] },
    leaderboardOptIn: false,
    unlockedThemes: [],
    unlockedAccessories: [],
    activeAccessory: null,
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    settingsRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: getRepositoryToken(UserSettings), useValue: settingsRepo },
      ],
    }).compile();

    service = module.get<SettingsService>(SettingsService);
  });

  describe('getSettings', () => {
    it('should return existing settings', async () => {
      settingsRepo.findOne.mockResolvedValue(mockSettings);

      const result = await service.getSettings(userId);

      expect(result).toEqual(mockSettings);
      expect(settingsRepo.findOne).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should create and return default settings when none exist', async () => {
      const newSettings = { ...mockSettings };
      settingsRepo.findOne.mockResolvedValue(null);
      settingsRepo.create.mockReturnValue(newSettings);
      settingsRepo.save.mockResolvedValue(newSettings);

      const result = await service.getSettings(userId);

      expect(result).toEqual(newSettings);
      expect(settingsRepo.create).toHaveBeenCalledWith({ userId });
      expect(settingsRepo.save).toHaveBeenCalledWith(newSettings);
    });
  });

  describe('updateSettings', () => {
    it('should update existing settings', async () => {
      const dto = { language: 'he', theme: 'dark' };
      const updatedSettings = { ...mockSettings, ...dto };
      settingsRepo.findOne.mockResolvedValue(mockSettings);
      settingsRepo.save.mockResolvedValue(updatedSettings);

      const result = await service.updateSettings(userId, dto);

      expect(result).toEqual(updatedSettings);
      expect(settingsRepo.save).toHaveBeenCalled();
    });

    it('should create default settings first if none exist, then update', async () => {
      const dto = { leaderboardOptIn: true };
      const newSettings = { ...mockSettings };
      const updatedSettings = { ...mockSettings, leaderboardOptIn: true };

      // getSettings call: findOne returns null, then create+save
      settingsRepo.findOne.mockResolvedValue(null);
      settingsRepo.create.mockReturnValue(newSettings);
      // First save is from getSettings creating defaults, second is from updateSettings
      settingsRepo.save
        .mockResolvedValueOnce(newSettings)
        .mockResolvedValueOnce(updatedSettings);

      const result = await service.updateSettings(userId, dto);

      expect(result).toEqual(updatedSettings);
      expect(settingsRepo.create).toHaveBeenCalledWith({ userId });
      // Called twice: once for creating defaults, once for updating
      expect(settingsRepo.save).toHaveBeenCalledTimes(2);
    });
  });
});
