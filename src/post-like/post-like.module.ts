import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardPosts } from '../entities/CardPosts.entity';
import { PostLikes } from '../entities/PostLikes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardPosts, PostLikes])],
  controllers: [PostLikeController],
  providers: [PostLikeService],
})
export class PostLikeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .forRoutes({ path: '/post/:postIdx', method: RequestMethod.PUT });
  }
}
