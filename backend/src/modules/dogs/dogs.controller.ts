import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DogsService } from './dogs.service';
import type { CreateDogDto, UpdateDogDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('dogs')
export class DogsController {
  constructor(private dogsService: DogsService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.dogsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.dogsService.findOne(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() createDogDto: CreateDogDto) {
    return this.dogsService.create(user.id, createDogDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateDogDto: UpdateDogDto,
  ) {
    return this.dogsService.update(id, user.id, updateDogDto);
  }

  @Post(':id/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/dogs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `dog-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadPhoto(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoPath = `/uploads/dogs/${file.filename}`;
    return this.dogsService.updatePhoto(id, user.id, photoPath);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.dogsService.remove(id, user.id);
  }
}
