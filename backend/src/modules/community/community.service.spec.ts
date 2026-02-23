import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CommunityService } from './community.service';
import { Post } from '../../entities/post.entity';
import { PostLike } from '../../entities/post-like.entity';
import { Comment } from '../../entities/comment.entity';

describe('CommunityService', () => {
  let service: CommunityService;
  let postRepo: jest.Mocked<Partial<Repository<Post>>>;
  let likeRepo: jest.Mocked<Partial<Repository<PostLike>>>;
  let commentRepo: jest.Mocked<Partial<Repository<Comment>>>;

  const userId = 'user-1';
  const postId = 'post-1';

  const mockPost: Post = {
    id: postId,
    userId,
    user: undefined,
    content: 'My dog learned a new trick!',
    type: 'general',
    metadata: null,
    likesCount: 0,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    postRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
    };
    likeRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    commentRepo = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        { provide: getRepositoryToken(Post), useValue: postRepo },
        { provide: getRepositoryToken(PostLike), useValue: likeRepo },
        { provide: getRepositoryToken(Comment), useValue: commentRepo },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
  });

  describe('getPosts', () => {
    it('should return paginated posts', async () => {
      const posts = [mockPost];
      postRepo.find.mockResolvedValue(posts);

      const result = await service.getPosts(1, 20);

      expect(result).toEqual([{
        id: mockPost.id,
        user_id: mockPost.userId,
        owner_name: null,
        content: mockPost.content,
        post_type: 'general',
        dog_name: null,
        breed: null,
        photo_url: null,
        badge_id: null,
        like_count: 0,
        comment_count: 0,
        created_at: mockPost.createdAt,
        metadata: null,
      }]);
      expect(postRepo.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: 20,
        skip: 0,
        select: { user: { id: true, name: true } },
      });
    });

    it('should use correct offset for page 2', async () => {
      postRepo.find.mockResolvedValue([]);

      await service.getPosts(2, 10);

      expect(postRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });

    it('should use default values when no args provided', async () => {
      postRepo.find.mockResolvedValue([]);

      await service.getPosts();

      expect(postRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ take: 20, skip: 0 }),
      );
    });
  });

  describe('createPost', () => {
    it('should create and return a post', async () => {
      const dto = { content: 'My dog learned a new trick!', postType: 'general' };
      postRepo.create.mockReturnValue(mockPost);
      postRepo.save.mockResolvedValue(mockPost);

      const result = await service.createPost(userId, dto);

      expect(result).toEqual(mockPost);
      expect(postRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId, content: dto.content, type: 'general' }),
      );
      expect(postRepo.save).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('toggleLike', () => {
    it('should add a like when none exists', async () => {
      const like = { id: 'like-1', postId, userId } as PostLike;
      postRepo.findOne.mockResolvedValue(mockPost);
      likeRepo.findOne.mockResolvedValue(null);
      likeRepo.create.mockReturnValue(like);
      likeRepo.save.mockResolvedValue(like);

      const result = await service.toggleLike(postId, userId);

      expect(result).toEqual({ liked: true });
      expect(likeRepo.create).toHaveBeenCalledWith({ postId, userId });
      expect(likeRepo.save).toHaveBeenCalledWith(like);
      expect(postRepo.increment).toHaveBeenCalledWith(
        { id: postId },
        'likesCount',
        1,
      );
    });

    it('should remove a like when one already exists', async () => {
      const existing = { id: 'like-1', postId, userId } as PostLike;
      postRepo.findOne.mockResolvedValue(mockPost);
      likeRepo.findOne.mockResolvedValue(existing);
      likeRepo.remove.mockResolvedValue(existing);

      const result = await service.toggleLike(postId, userId);

      expect(result).toEqual({ liked: false });
      expect(likeRepo.remove).toHaveBeenCalledWith(existing);
      expect(postRepo.decrement).toHaveBeenCalledWith(
        { id: postId },
        'likesCount',
        1,
      );
    });

    it('should throw NotFoundException when post not found', async () => {
      postRepo.findOne.mockResolvedValue(null);

      await expect(service.toggleLike(postId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getComments', () => {
    it('should return comments for a post', async () => {
      const comments = [
        { id: 'c-1', postId, userId, content: 'Great!' },
      ] as Comment[];
      commentRepo.find.mockResolvedValue(comments);

      const result = await service.getComments(postId);

      expect(result).toEqual(comments);
      expect(commentRepo.find).toHaveBeenCalledWith({
        where: { postId },
        relations: ['user'],
        order: { createdAt: 'ASC' },
        select: { user: { id: true, name: true } },
      });
    });
  });

  describe('createComment', () => {
    it('should create and return a comment', async () => {
      const dto = { content: 'Great job!' };
      const comment = {
        id: 'c-1',
        postId,
        userId,
        content: 'Great job!',
      } as Comment;
      postRepo.findOne.mockResolvedValue(mockPost);
      commentRepo.create.mockReturnValue(comment);
      commentRepo.save.mockResolvedValue(comment);

      const result = await service.createComment(postId, userId, dto);

      expect(result).toEqual(comment);
      expect(commentRepo.create).toHaveBeenCalledWith({
        ...dto,
        postId,
        userId,
      });
      expect(commentRepo.save).toHaveBeenCalledWith(comment);
    });

    it('should throw NotFoundException when post not found', async () => {
      postRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createComment(postId, userId, { content: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
