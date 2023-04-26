import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
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
  }
}
