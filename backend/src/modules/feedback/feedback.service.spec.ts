import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackService } from './feedback.service';
import { Feedback } from '../../entities/feedback.entity';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let feedbackRepo: jest.Mocked<Partial<Repository<Feedback>>>;

  const userId = 'user-1';

  const mockFeedback: Feedback = {
    id: 'fb-1',
    userId,
    user: undefined,
    type: 'general',
    message: 'Great app!',
    rating: 5,
    metadata: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    feedbackRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: getRepositoryToken(Feedback), useValue: feedbackRepo },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  describe('create', () => {
    it('should create and return feedback', async () => {
      const dto = { type: 'general', message: 'Great app!', rating: 5 };
      feedbackRepo.create.mockReturnValue(mockFeedback);
      feedbackRepo.save.mockResolvedValue(mockFeedback);

      const result = await service.create(userId, dto);

      expect(result).toEqual(mockFeedback);
      expect(feedbackRepo.create).toHaveBeenCalledWith({ ...dto, userId });
      expect(feedbackRepo.save).toHaveBeenCalledWith(mockFeedback);
    });

    it('should create feedback with minimal fields', async () => {
      const dto = { message: 'Bug report' };
      const feedback = { ...mockFeedback, message: 'Bug report', rating: null } as Feedback;
      feedbackRepo.create.mockReturnValue(feedback);
      feedbackRepo.save.mockResolvedValue(feedback);

      const result = await service.create(userId, dto);

      expect(result).toEqual(feedback);
      expect(feedbackRepo.create).toHaveBeenCalledWith({ ...dto, userId });
    });
  });

  describe('findAll', () => {
    it('should return all feedback sorted by createdAt DESC with user relation', async () => {
      const feedbacks = [mockFeedback];
      feedbackRepo.find.mockResolvedValue(feedbacks);

      const result = await service.findAll();

      expect(result).toEqual(feedbacks);
      expect(feedbackRepo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });
    });

    it('should return empty array when no feedback exists', async () => {
      feedbackRepo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
