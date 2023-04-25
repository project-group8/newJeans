import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { CardpostsController } from './cardposts.controller';
import { CardpostsService } from './cardposts.service';
import { AuthMiddleWare } from 'src/middleware/authMiddleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlDataSource from '../config/typeorm-cli.config';
import { Users } from '../entities/Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users], mysqlDataSource)],
  controllers: [CardpostsController],
  providers: [CardpostsService],
})
export class CardpostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes('*');
  }
}
