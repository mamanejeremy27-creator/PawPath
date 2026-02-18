import {
  Controller, Get, Post, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto, CreateCommentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {}

  @Get('posts')
  getPosts(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.communityService.getPosts(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Post('posts')
  createPost(@CurrentUser() user: User, @Body() dto: CreatePostDto) {
    return this.communityService.createPost(user.id, dto);
  }

  @Post('posts/:id/like')
  toggleLike(@Param('id') id: string, @CurrentUser() user: User) {
    return this.communityService.toggleLike(id, user.id);
  }

  @Get('posts/:id/comments')
  getComments(@Param('id') id: string) {
    return this.communityService.getComments(id);
  }

  @Post('posts/:id/comments')
  createComment(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.createComment(id, user.id, dto);
  }
}
