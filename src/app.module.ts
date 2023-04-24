import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardpostsController } from './cardposts/cardposts.controller';
import { CardpostsModule } from './cardposts/cardposts.module';
import { CommentsModule } from './comments/comments.module';
import { ReplycommentsModule } from './replycomments/replycomments.module';
import { PreferModule } from './prefer/prefer.module';
import { CommentLikeModule } from './comment-like/comment-like.module';
import { PostLikeModule } from './post-like/post-like.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [],
    }),
    ConfigModule.forRoot(),
    CardpostsModule,
    CommentsModule,
    ReplycommentsModule,
    PreferModule,
    CommentLikeModule,
    PostLikeModule,
    UsersModule,
  ],
  controllers: [AppController, CardpostsController],
  providers: [AppService],
})
export class AppModule {}