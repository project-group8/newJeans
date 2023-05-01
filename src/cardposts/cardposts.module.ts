import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CardpostsController } from './cardposts.controller';
import { CardpostsService } from './cardposts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlDataSource from '../config/typeorm-cli.config';
import { Users } from '../entities/Users.entity';
import { CardPosts } from '../entities/CardPosts.entity';
import { Comments } from '../entities/Comments.entity';
import { PostLikes } from '../entities/PostLikes.entity';
import { Prefers } from '../entities/Prefers.entity';
import { PostCountUpMiddleware } from '../middleware/postCountUpMiddleware';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, CardPosts, PostLikes, Comments, Prefers]),
    UploadsModule,
  ],
  controllers: [CardpostsController],
  providers: [CardpostsService],
})
export class CardpostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PostCountUpMiddleware).forRoutes({
      path: 'postCards/post/:postIdx',
      method: RequestMethod.GET,
    });
  }
}
