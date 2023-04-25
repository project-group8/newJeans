import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardpostsModule } from './cardposts/cardposts.module';
import { CommentsModule } from './comments/comments.module';
import { ReplycommentsModule } from './replycomments/replycomments.module';
import { PreferModule } from './prefer/prefer.module';
import { CommentLikeModule } from './comment-like/comment-like.module';
import { PostLikeModule } from './post-like/post-like.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        entities: ['src/entities/*.ts'],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
