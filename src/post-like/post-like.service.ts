import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { CardPosts } from '../entities/CardPosts.entity';
import { PostLikes } from '../entities/PostLikes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLikes)
    private postLikesRepository: Repository<PostLikes>,
    @InjectRepository(CardPosts)
    private cardPostsRepository: Repository<CardPosts>,
  ) {}

  /**
   * 1. post에 좋아요를 토글합니다.
   * @param userIdx
   * @param postIdx
   * @returns
   */
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
      await this.postLikesRepository.save({ userIdx, postIdx });
      const message: string = '좋아요를 등록하였습니다.';
      return message;
    } else {
      await this.postLikesRepository
        .createQueryBuilder()
        .delete()
        .from(PostLikes)
        .where('postIdx = :postIdx AND userIdx = :userIdx', {
          userIdx,
          postIdx,
        })
        .execute();
      const message: string = '좋아요를 취소하였습니다.';

      return message;
    }
  }
}
