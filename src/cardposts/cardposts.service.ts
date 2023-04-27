import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users.entity';
import { CardPosts } from '../entities/CardPosts.entity';
import { Repository } from 'typeorm';
import { SplitCardsDto, CreateCardDto } from './dto/cardposts.dto';
import { PostLikes } from '../entities/PostLikes.entity';
import { Comments } from '../entities/Comments.entity';
import { Prefers } from '../entities/Prefers.entity';
import { UUID } from 'crypto';
import { SelectQueryBuilder, UpdateResult, DeleteResult } from 'typeorm';

@Injectable()
export class CardpostsService {
  constructor(
    @InjectRepository(CardPosts)
    private cardPostsRepository: Repository<CardPosts>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  /**
   * email로 유저의 userIdx를 찾습니다.
   * @param email
   * @returns
   */
  async findUser(email: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: { email },
      select: ['userIdx'],
    });
  }

  /**
   * 1. 페이지 네이션으로 작동합니다.
   * 2. 핫 훈수 카드로 작동합니다.
   * @param SplitCardsDto
   * @returns
   */
  async findSplitCards({
    maincategory,
    category,
    splitNumber,
    splitPageNumber,
  }: SplitCardsDto): Promise<object[]> {
    const now: Date = new Date();
    const sevenDaysAgo: Date = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
    const qb: SelectQueryBuilder<object> = await this.cardPostsRepository
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
        'COUNT(DISTINCT c.commentIdx) as commentCount',
        'COUNT(DISTINCT pl.postLikeIdx) as likesCount',
      ]);
    /**
     * 값이 없으면 상위 5개의 인기 게시글을 노출합니다.
     */
    if (!maincategory && !category && !splitNumber && !splitPageNumber) {
      qb.andWhere('cp.createdAt > :sevenDaysAgo', { sevenDaysAgo })
        .orderBy('value', 'DESC')
        .limit(5)
        .addSelect(
          `(COUNT(DISTINCT pl.postLikeIdx) * (FLOOR(RAND()*(10-5+1))+5) + (COUNT(cp.viewCount)  + COUNT(c.commentIdx)) * (FLOOR(RAND()*(20-10+1))+10))`,
          'value',
        );
    }

    /**
     * 인자에 따라서 페이지 네이션 기능을 합니다.
     */
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

  /**
   * 1. 지정한 카드를 불러들입니다.
   * 2. 로그인한 유저라면 포스트에 좋아요를 했는지 봅니다.
   * @param postIdx
   */
  async findOnePost(postIdx: UUID): Promise<object> {
    const qb: SelectQueryBuilder<object> = await this.cardPostsRepository
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
        `COUNT(DISTINCT pl.postLikeIdx) as likesCount`,
        `COUNT(DISTINCT c.commentIdx) as commentCount`,
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
      // .setParameter('userIdx',  userIdx );
    } else {
      qb.addSelect('false', 'IsLike');
    }

    return qb.getRawOne();
  }

  /**
   * 지정한 카드의 Content를 가져옵니다.
   * @param postIdx
   * @returns
   */
  async findOnePostContents(postIdx: UUID): Promise<object> {
    let userIdx = '';

    const qb: SelectQueryBuilder<object> = await this.cardPostsRepository
      .createQueryBuilder('cp')
      .where('cp.postIdx = :postIdx', { postIdx })
      .leftJoin(Prefers, 'p', 'cp.postIdx = p.postIdx')
      .groupBy('cp.postIdx')
      .select([
        'cp.pollType as pollType',
        'cp.pollTitle as pollTitle',
        'cp.imgUrl as imgUrl',
        'cp.tag as tag',
        'COUNT(CASE WHEN p.selectprefer = 7 THEN 1 END) as conCount',
        'COUNT(CASE WHEN p.selectprefer = 8 THEN 1 END) as proCount',
        `CASE WHEN EXISTS(
          SELECT 1 FROM Prefers p WHERE p.userIdx = :userIdx AND p.selectprefer = 7)
          THEN true ELSE false END as proInputValue`,
        `CASE WHEN EXISTS(
          SELECT 1 FROM Prefers p WHERE p.userIdx = :userIdx AND p.selectprefer = 8)
          THEN true ELSE false END as conInputValue`,
      ])
      .setParameter('userIdx', userIdx);

    return qb.getRawOne();
  }

  /**
   * 지정한 카드의 Category를 가져옵니다.
   * @param postIdx
   * @returns
   */
  async findOnePostCategorys(postIdx: UUID): Promise<object> {
    return await this.cardPostsRepository.findOne({
      where: { postIdx },
      select: ['category', 'maincategory'],
    });
  }

  /**
   * 카드를 생성합니다.
   * @param createCardDto
   * @returns
   */
  async postCard(createCardDto: CreateCardDto): Promise<CardPosts> {
    const {
      maincategory,
      category,
      title,
      desc,
      tag,
      imgUrl,
      pollType,
      pollTitle,
    } = createCardDto;

    const createPost: CardPosts = await this.cardPostsRepository.create({
      maincategory,
      category,
      title,
      desc,
      tag,
      imgUrl,
      pollType,
      pollTitle,
    });

    return createPost;
  }

  /**
   * 카드를 업데이트 합니다.
   * @param postIdx
   * @param createCardDto
   * @returns
   */
  async updatePost(
    postIdx: string,
    createCardDto: CreateCardDto,
  ): Promise<UpdateResult> {
    const {
      maincategory,
      category,
      title,
      desc,
      tag,
      imgUrl,
      pollType,
      pollTitle,
    } = createCardDto;

    const updatePost: UpdateResult = await this.cardPostsRepository
      .createQueryBuilder('cp')
      .update(CardPosts)
      .set({
        maincategory,
        category,
        title,
        desc,
        tag,
        imgUrl,
        pollType,
        pollTitle,
      })
      .where('cp.postIdx = :postIdx', { postIdx })
      .execute();

    return updatePost;
  }

  /**
   * 카드를 삭제합니다.
   * @param postIdx
   * @returns
   */
  async deletePost(postIdx: UUID): Promise<void> {
    const exeistPost: CardPosts = await this.cardPostsRepository.findOne({
      where: { postIdx },
    });

    if (!exeistPost) {
      throw new BadRequestException('해당 게시글이 존재하지 않습니다.');
    }

    const deletePost: DeleteResult = await this.cardPostsRepository
      .createQueryBuilder('cp')
      .delete()
      .from(CardPosts)
      .where('cp.postIdx = :postIdx', { postIdx })
      .andWhere('') // 유저 조건 추가해야함
      .execute();

    deletePost;
    return;
  }
}
