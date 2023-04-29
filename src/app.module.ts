import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardpostsModule } from './cardposts/cardposts.module';
import { PreferModule } from './prefer/prefer.module';
import { CommentLikeModule } from './comment-like/comment-like.module';
import { PostLikeModule } from './post-like/post-like.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from 'src/entities/Users.entity';
import { CardPosts } from 'src/entities/CardPosts.entity';
import { Chats } from 'src/entities/Chats.entity';
import { ChatSaves } from 'src/entities/ChatSaves.entity';
import { CommentLikes } from 'src/entities/CommentLikes.entity';
import { Comments } from 'src/entities/Comments.entity';
import { PostLikes } from 'src/entities/PostLikes.entity';
import { Prefers } from 'src/entities/Prefers.entity';
import { ReplyComments } from 'src/entities/ReplyComments.entity';
import { Tokens } from './entities/Tokens.entity';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { UploadsModule } from './uploads/uploads.module';
import { ReplycommentsModule } from './replycomments/replycomments.module';
import { SlackExceptionFilter } from './slack/slack';
import { SlackService } from './slack/slack.config';
import { APP_FILTER } from '@nestjs/core';
import { TestController } from './slack/slack-error-mesage-test';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          Users,
          CardPosts,
          Chats,
          ChatSaves,
          CommentLikes,
          Comments,
          PostLikes,
          Prefers,
          ReplyComments,
          Tokens,
        ],
        synchronize: false, // !!! true 절대 금지 꼭 팀적으로 상의할 것 !!!
      }),
    }),
    CardpostsModule,
    CommentsModule,
    ReplycommentsModule,
    PreferModule,
    CommentLikeModule,
    PostLikeModule,
    UsersModule,
    ChatModule,
    UsersModule,
    UploadsModule,
    AuthModule,
  ],
  controllers: [AppController, TestController],
  providers: [
    AppService,
    SlackService,
    { provide: APP_FILTER, useClass: SlackExceptionFilter },
  ],
})
export class AppModule {}
