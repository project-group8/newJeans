import { Module } from '@nestjs/common';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';

@Module({
  controllers: [PostLikeController],
  providers: [PostLikeService]
})
export class PostLikeModule {}
