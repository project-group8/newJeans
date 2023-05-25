import { Module } from '@nestjs/common';
import { CommentLikeController } from './comment-like.controller';
import { CommentLikeService } from './comment-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLikes } from '../entities/CommentLikes.entity';
import mysqlDataSource from '../config/typeorm-cli.config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentLikes], mysqlDataSource),
    AuthModule,
    UsersModule,
  ],
  controllers: [CommentLikeController],
  providers: [CommentLikeService],
})
export class CommentLikeModule {}
