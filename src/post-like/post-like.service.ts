import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { CardPosts } from 'src/entities/CardPosts.entity';
import { PostLikes } from 'src/entities/PostLikes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLikes)
    private postLikesRepository: Repository<PostLikes>,
    @InjectRepository(CardPosts)
    private cardPostsRepository: Repository<CardPosts>,
  ) {}

  async postToggleLike(userIdx: UUID, postIdx: UUID): Promise<string> {
    const exeistPost: CardPosts = await this.cardPostsRepository.findOne({
      where: { postIdx },
    });

    if (!exeistPost) {
      throw new BadRequestException('게시글이 존재하지 않습니다.');
    }

    const isLike: PostLikes = await this.postLikesRepository.findOne({
      where: { userIdx, postIdx },
    });

    if (!isLike) {
      await this.postLikesRepository.create({ userIdx, postIdx });
      const message: string = '좋아요를 등록하였습니다.';
      return message;
    } else {
      await this.postLikesRepository
        .createQueryBuilder('pl')
        .delete()
        .from(PostLikes)
        .where('pl.postIdx = :postIdx AND pl.userIdx = :userIdx', {
          userIdx,
          postIdx,
        })
        .execute();
      const message: string = '좋아요를 취소하였습니다.';
      return message;
    }
  }
}
