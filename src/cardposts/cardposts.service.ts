import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users.entity';
import { CardPosts } from '../entities/CardPosts.entity';
import { Repository } from 'typeorm';
import { SplitCardsDto } from './dto/cardposts.dto';
import { PostLikes } from '../entities/PostLikes.entity';
import { Comments } from '../entities/Comments.entity';
import { Prefers } from '../entities/Prefers.entity';
import { UUID } from 'crypto';

@Injectable()
export class CardpostsService {
  constructor(
    @InjectRepository(CardPosts)
    private readonly cardPostsRepository: Repository<CardPosts>,
  ) {}

  /**
   * 1. 페이지 네이션으로 작동합니다.
   * 2. 핫 훈수 카드로 작동합니다.
   */
  async findSplitCards({
    maincategory,
    category,
    splitNumber,
    splitPageNumber,
  }: SplitCardsDto): Promise<Object> {
    const now: Date = new Date();
    const sevenDaysAgo: Date = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
    const qb: any = await this.cardPostsRepository
      .createQueryBuilder('cp')
      .leftJoin(Users, 'u', 'cp.userIdx = u.userIdx')
      .leftJoin(Comments, 'c', 'cp.postIdx = c.postIdx')
      .leftJoin(PostLikes, 'pl', 'cp.postIdx = pl.postIdx')
      .groupBy('cp.postIdx')
      .select([
        'cp.postIdx as postIdx',
        'cp.maincategory as maincategory',
        'cp.category as category',
        'cp.title as title',
        'cp.desc as `desc`',
        'u.nickname as nickname',
        `DATE_FORMAT(CONVERT_TZ(cp.createdAt, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') as createdAt`,
        'cp.viewCount as postViewCount',
        "CASE WHEN cp.imgUrl = '' THEN false ELSE true END as isImg",
        'COUNT(c.commentIdx) as commentCount',
        'COUNT(pl.postLikeIdx) as likesCount',
      ]);

    if (!maincategory && !category && !splitNumber && !splitPageNumber) {
      qb.andWhere('cp.createdAt > :sevenDaysAgo', { sevenDaysAgo })
        .orderBy('value', 'DESC')
        .limit(5)
        .addSelect(
          `(COUNT(pl.postLikeIdx) * (FLOOR(RAND()*(10-5+1))+5) + (COUNT(cp.viewCount)  + COUNT(c.commentIdx)) * (FLOOR(RAND()*(20-10+1))+10))`,
          'value',
        );
    }

    if (
      maincategory !== undefined &&
      category !== undefined &&
      splitNumber &&
      splitPageNumber
    ) {
      qb.orderBy('cp.createdAt', 'DESC')
        .where(
          !maincategory ? {} : { maincategory },
          !category ? {} : { category },
        )
        .limit(splitNumber)
        .offset(splitNumber * (splitPageNumber - 1));
    }

    return qb.getRawMany();
  }

  async findOnePost(postIdx: UUID): Promise<Object> {
    const qb = await this.cardPostsRepository
      .createQueryBuilder('cp')
      .where(`cp.postIdx = :postIdx`, { postIdx })
      .leftJoin(PostLikes, 'pl', 'cp.postIdx = pl.postIdx')
      .leftJoin(Comments, 'c', 'cp.postIdx = c.postIdx')
      .leftJoin(Users, 'u', 'cp.userIdx = u.userIdx')
      .select([
        'cp.desc as `desc`',
        'cp.postIdx as postIdx',
        'cp.title as title',
        'cp.viewCount as postViewCount',
        `DATE_FORMAT(CONVERT_TZ(cp.createdAt, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') as createdAt`,
        `COUNT(pl.postLikeIdx) as likesCount`,
        `COUNT(c.commentIdx) as commentCount`,
        'u.nickname as nickname',
      ]);

    if (false) {
      // email로 유저 검증해서 값 받을것이다.
      qb.addSelect(
        `CASE WHEN EXISTS (
          SELECT 1 FROM PostLikes pl WHERE pl.postIdx = cp.postIdx AND pl.userIdx = :userIdx
        ) THEN true ELSE false END`,
        'IsLike',
      );
    } else {
      qb.addSelect('false', 'IsLike');
    }

    return qb.getRawOne();
  }
}
