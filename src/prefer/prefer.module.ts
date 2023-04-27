import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PreferController } from './prefer.controller';
import { PreferService } from './prefer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prefers } from 'src/entities/Prefers.entity';
import { CardPosts } from 'src/entities/CardPosts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prefers, CardPosts])],
  controllers: [PreferController],
  providers: [PreferService],
})
export class PreferModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply() // 인증 해야함
      .forRoutes({ path: 'prefer/post/:postIdx', method: RequestMethod.PUT });
  }
}
