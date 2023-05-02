import { CommentsController } from './comments.controller';
import { UsersModule } from './../users/users.module';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comments } from 'src/entities/Comments.entity';
import mysqlDataSource from 'src/config/typeorm-cli.config';
import { CommentLikes } from 'src/entities/CommentLikes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments, CommentLikes], mysqlDataSource),
    AuthModule,
    UsersModule,
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}