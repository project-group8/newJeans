import { Injectable, NestMiddleware } from '@nestjs/common';
import { CardPosts } from '../entities/CardPosts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostCountUpMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(CardPosts)
    private cardPostsRepository: Repository<CardPosts>,
  ) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    const { postIdx } = req.params;

    const cardPost = await this.cardPostsRepository.findOne({
      where: { postIdx },
    });
    const viewCount = cardPost.viewCount + 1;
    await this.cardPostsRepository.update(postIdx, { viewCount });

    next();
  }
}
