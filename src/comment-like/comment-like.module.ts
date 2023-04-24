import { Module } from '@nestjs/common';
import { CommentLikeController } from './comment-like.controller';
import { CommentLikeService } from './comment-like.service';

@Module({
  controllers: [CommentLikeController],
  providers: [CommentLikeService]
})
export class CommentLikeModule {}
