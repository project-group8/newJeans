import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CardpostsController } from './cardposts.controller';
import { CardpostsService } from './cardposts.service';
import { AuthMiddleWare } from 'src/middleware/authMiddleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlDataSource from '../config/typeorm-cli.config';
import { Users } from '../entities/Users.entity';
import { CardPosts } from '../entities/CardPosts.entity';
import { Comments } from '../entities/Comments.entity';
import { PostLikes } from '../entities/PostLikes.entity';
import { Prefers } from '../entities/Prefers.entity';
import { PostCountUpMiddleware } from 'src/middleware/postCountUpMiddleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, CardPosts, PostLikes, Comments, Prefers]),
  ],
  controllers: [CardpostsController],
  providers: [CardpostsService],
})
export class CardpostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes('*');
    consumer.apply(PostCountUpMiddleware).forRoutes({
      // allusers 미들웨어 있어야함
      path: 'postCards/post/:postIdx',
      method: RequestMethod.GET,
    });
    consumer.apply().forRoutes({
      // allusers 미들웨어 있어야함
      path: 'postCards/post/contents/:postIdx',
      method: RequestMethod.GET,
    });
    consumer.apply().forRoutes({
      // authmiddleware 달아줘야함
      path: 'postCards/post/createPost',
      method: RequestMethod.POST,
    });
    consumer.apply().forRoutes({
      // authmiddleware 달아줘야함
      path: 'postCards/post/createPost/:postIdx',
      method: RequestMethod.PUT,
    });
    consumer
      .apply() // authmiddleware 달아줘야함
      .forRoutes({
        path: 'postCards/post/createPost/:postIdx',
        method: RequestMethod.DELETE,
      });
  }
}
