import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
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

    const existPost = await this.cardPostsRepository.findOne({
      where: { postIdx },
    });
    if (!existPost) {
      throw new BadRequestException('해당 포스트가 존재하지 않습니다.');
    }

    const cardPost: CardPosts | undefined =
      await this.cardPostsRepository.findOne({
        where: { postIdx },
      });

    const viewCount: number = cardPost.viewCount + 1;

    await this.cardPostsRepository.update(postIdx, { viewCount });

    next();
  }
}
