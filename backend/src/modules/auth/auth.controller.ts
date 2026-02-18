import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterDto } from './dto';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators';
import type { User } from '../../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    const { passwordHash, ...user } = result.user;
    return { accessToken: result.accessToken, user };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User) {
    const result = await this.authService.login(user);
    const { passwordHash, ...userWithoutPassword } = result.user;
    return { accessToken: result.accessToken, user: userWithoutPassword };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: User) {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
