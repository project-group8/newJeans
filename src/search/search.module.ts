import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardPosts } from '../entities/CardPosts.entity';
import mysqlDataSource from '../config/typeorm-cli.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardPosts], mysqlDataSource),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        // host: '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      },
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
