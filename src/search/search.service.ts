import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { CardPosts } from '../entities/CardPosts.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(CardPosts)
    private readonly cardPostRepository: Repository<CardPosts>,
  ) // private readonly redis: Redis,
  {}

  async search(query: string): Promise<CardPosts[]> {
    const redisClient = new Redis();
    const cacheKey = `search:${query}`;

    // 캐시에 해당 검색어가 있는지 확인
    const cachedResults = await redisClient.get(cacheKey);
    if (cachedResults) {
      return JSON.parse(cachedResults);
    }

    // 검색 결과를 데이터베이스에서 가져옴
    const results = await this.cardPostRepository
      .createQueryBuilder('post')
      .where('post.title LIKE :query OR post.desc LIKE :query', {
        query: `%${query}%`,
      })
      .getMany();

    // 검색 결과를 캐시에 저장
    await redisClient.set(cacheKey, JSON.stringify(results), 'EX', 600);

    return results;
  }
}
