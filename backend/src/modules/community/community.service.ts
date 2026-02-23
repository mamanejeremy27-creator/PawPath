import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { PostLike } from '../../entities/post-like.entity';
import { Comment } from '../../entities/comment.entity';
import type { CreatePostDto, CreateCommentDto } from './dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostLike) private likeRepo: Repository<PostLike>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async getPosts(page = 1, limit = 20) {
    const posts = await this.postRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        user: { id: true, name: true },
      },
    });

    // Map to the shape the frontend expects (snake_case + flattened metadata)
    return posts.map(p => ({
      id: p.id,
      user_id: p.userId,
      owner_name: p.user?.name || null,
      content: p.content,
      post_type: p.type || 'general',
      dog_name: p.metadata?.dogName || null,
      breed: p.metadata?.breed || null,
      photo_url: p.metadata?.photoUrl || null,
      badge_id: p.metadata?.badgeId || null,
      like_count: p.likesCount || 0,
      comment_count: 0,
      created_at: p.createdAt,
      metadata: p.metadata,
    }));
  }

  async createPost(userId: string, dto: CreatePostDto): Promise<Post> {
    const { content, postType, dogId, dogName, breed, photoUrl, badgeId, metadata } = dto;
    const post = this.postRepo.create({
      userId,
      content,
      type: postType || 'general',
      metadata: {
        ...metadata,
        dogId: dogId || undefined,
        dogName: dogName || undefined,
        breed: breed || undefined,
        photoUrl: photoUrl || undefined,
        badgeId: badgeId || undefined,
      },
    });
    return this.postRepo.save(post);
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.likeRepo.findOne({ where: { postId, userId } });
    if (existing) {
      await this.likeRepo.remove(existing);
      await this.postRepo.decrement({ id: postId }, 'likesCount', 1);
      return { liked: false };
    }
    const like = this.likeRepo.create({ postId, userId });
    await this.likeRepo.save(like);
    await this.postRepo.increment({ id: postId }, 'likesCount', 1);
    return { liked: true };
  }

  async getComments(postId: string) {
    return this.commentRepo.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      select: {
        user: { id: true, name: true },
      },
    });
  }

  async createComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    const comment = this.commentRepo.create({ ...dto, postId, userId });
    return this.commentRepo.save(comment);
  }
}
