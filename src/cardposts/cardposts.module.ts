import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CardpostsController } from './cardposts.controller';
import { CardpostsService } from './cardposts.service';
import { AuthMiddleWare } from 'src/middleware/authMiddleware';

@Module({
  controllers: [CardpostsController],
  providers: [CardpostsService],
})
export class CardpostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes('*');
  }
}
