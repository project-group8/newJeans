import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users.entity';
import { CardPosts } from '../entities/CardPosts.entity';
import { Repository } from 'typeorm';
import {
  SplitCardsDto,
  CreateCardDto,
  CardPostWithIsLike,
  CardPostWithContents,
} from './dto/cardposts.dto';
import { PostLikes } from '../entities/PostLikes.entity';
import { Comments } from '../entities/Comments.entity';
import { Prefers } from '../entities/Prefers.entity';
import { UUID } from 'crypto';
import {
  SelectQueryBuilder,
  UpdateResult,
  DeleteResult,
  DeepPartial,
} from 'typeorm';
import { UploadsService } from '../uploads/uploads.service';
import { OpenAIApi, Configuration } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CardpostsService {
  constructor(
    @InjectRepository(CardPosts)
    private cardPostsRepository: Repository<CardPosts>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Comments)
    private readonly CommentRepository: Repository<Comments>,
    private uploadsService: UploadsService,
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
   * 1.
   * 1) 페이지 네이션으로 작동합니다.
   * 2) 핫 훈수 카드로 작동합니다.
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
     * 1-1. 값이 없으면 상위 5개의 인기 게시글을 노출합니다.
     */
    if (!maincategory && !category && !splitNumber && !splitPageNumber) {
      qb.andWhere('cp.createdAt > :sevenDaysAgo', { sevenDaysAgo })
        .orderBy('value', 'DESC')
        .limit(5)
        .addSelect(
          '(COUNT(DISTINCT pl.postLikeIdx) * (FLOOR(RAND()*(10-5+1))+5) + cp.viewCount + (COUNT(c.commentIdx) * FLOOR(RAND()*(20-10+1))+10))',
          'value',
        );
    }

    /**
     * 1-2. 인자에 따라서 페이지 네이션 기능을 합니다.
     */
    if (
      maincategory !== undefined &&
      category !== undefined &&
      splitNumber &&
      splitPageNumber
    ) {
      qb.orderBy('cp.createdAt', 'DESC')
        .where(!maincategory ? {} : { maincategory })
        .andWhere(!category ? {} : { category })
        .limit(splitNumber)
        .offset(splitNumber * (splitPageNumber - 1));
    }

    return qb.getRawMany();
  }

  /**
   * 3.
   * 1) 지정한 카드를 불러들입니다.
   * 2) 로그인한 유저라면 포스트에 좋아요를 했는지 봅니다.
   * @param postIdx
   */
  async findOnePost(userIdx: UUID, postIdx: UUID): Promise<CardPostWithIsLike> {
    const qb: SelectQueryBuilder<CardPosts> = await this.cardPostsRepository
      .createQueryBuilder('cp')
      .where(`cp.postIdx = :postIdx`, { postIdx })
      .leftJoin(PostLikes, 'pl', 'cp.postIdx = pl.postIdx')
      .leftJoin(Comments, 'c', 'cp.postIdx = c.postIdx')
      .leftJoin(Users, 'u', 'cp.userIdx = u.userIdx')
      .groupBy('cp.postIdx')
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

    if (userIdx) {
      qb.addSelect(
        `CASE WHEN EXISTS (
          SELECT pl.* FROM PostLikes pl WHERE pl.postIdx = cp.postIdx AND pl.userIdx = :userIdx
        ) THEN true ELSE false END as IsLike`,
      ).setParameter('userIdx', userIdx);
    } else if (!userIdx) {
      qb.addSelect('false', 'IsLike');
    }

    const result = await qb.getRawOne();

    result.IsLike = result.IsLike === '1';

    return result;
  }

  /**
   * 4. 지정한 카드의 Content를 가져옵니다.
   * @param postIdx
   * @returns
   */
  async findOnePostContents(
    userIdx: UUID,
    postIdx: UUID,
  ): Promise<CardPostWithContents> {
    const qb: SelectQueryBuilder<CardPosts> = await this.cardPostsRepository
      .createQueryBuilder('cp')
      .where('cp.postIdx = :postIdx', { postIdx })
      .leftJoin('cp.Prefers', 'p')
      .setParameters({ userIdx, postIdx })
      .groupBy('cp.postIdx')
      .select([
        'cp.pollType as pollType',
        'cp.pollTitle as pollTitle',
        'cp.tag as tag',
        'COUNT(CASE WHEN COALESCE(p.selectprefer, 0) = 7 THEN 1 END) as proCount',
        'COUNT(CASE WHEN COALESCE(p.selectprefer, 0) = 8 THEN 1 END) as conCount',
        `CASE WHEN EXISTS(
          SELECT p.* FROM Prefers p WHERE p.userIdx = :userIdx AND p.selectprefer = 7 AND p.postIdx = :postIdx)
          THEN true ELSE false END as proInputValue`,
        `CASE WHEN EXISTS(
          SELECT p.* FROM Prefers p WHERE p.userIdx = :userIdx AND p.selectprefer = 8 AND p.postIdx = :postIdx)
          THEN true ELSE false END as conInputValue`,
      ]);

    const result = await qb.getRawOne();

    result.conCount = Number(result.conCount);
    result.proCount = Number(result.proCount);
    result.proInputValue = result.proInputValue === '1';
    result.conInputValue = result.conInputValue === '1';

    return result;
  }

  /**
   * 5. 지정한 카드의 Category를 가져옵니다.
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
   * test : OpenAI 테스트입니다.
   * @returns
   */
  getOpenAIApiInstance(): OpenAIApi {
    const configuration = new Configuration({
      organization: process.env.OPENAI_OG,
      apiKey: process.env.OPENAI_APIKEY,
    });

    return new OpenAIApi(configuration);
  }

  /**
   * 6. 카드를 생성합니다.
   * @param createCardDto
   * @returns
   */
  async postCard(
    userIdx: UUID,
    createCardDto: CreateCardDto,
    files: Array<Express.Multer.File>,
  ): Promise<CardPosts> {
    const {
      maincategory,
      category,
      title,
      desc,
      tag,
      pollType,
      pollTitle,
    }: CreateCardDto = createCardDto;
    const test = title;

    const openai = this.getOpenAIApiInstance();

    const imageList = [];
    if (files) {
      const uploadImage = await this.uploadsService.uploadFileToS3(files);
      uploadImage.forEach((data) => {
        const key = data['key'].split('/');

        imageList.push(key[0]);
      });
    }

    const Chatimg = imageList.join(',');
    const createPostPromise = this.cardPostsRepository.save<
      DeepPartial<CardPosts>
    >({
      userIdx,
      maincategory,
      category,
      title,
      desc,
      tag,
      imgUrl: Chatimg,
      pollType,
      pollTitle,
    });

    const chatbotResponsePromise = openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `나는 인공지능 AI Chatbot이야. 질문을 하면 내가 답변을 해줄께. 만약 모른다면 "모름"이라고 할께.\n\nQ: ${test}\nA:`,
      temperature: 0.8,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['\n'],
    });

    const [createPost, response] = await Promise.all([
      createPostPromise,
      chatbotResponsePromise,
    ]);

    const addBotComment = response.data.choices[0].text;
    const addApiComment = createPost.postIdx;

    await this.CommentRepository.save<DeepPartial<Comments>>({
      userIdx: 'c08f3c63-c2b3-4d15-8eaa-1ba0610f7323',
      comment: addBotComment,
      selectedTag: '',
      postIdx: addApiComment,
    });

    return createPost;
  }

  /**
   * 7. 게시글을 수정합니다.
   * @param userIdx
   * @param postIdx
   * @param createCardDto
   * @param files
   * @returns
   */
  async updatePost(
    userIdx: UUID,
    postIdx: UUID,
    createCardDto: CreateCardDto,
    files: Array<Express.Multer.File>,
  ): Promise<UpdateResult> {
    const {
      maincategory,
      category,
      title,
      desc,
      tag,
      pollType,
      pollTitle,
    }: CreateCardDto = createCardDto;

    const existPost = await this.cardPostsRepository.findOne({
      where: { postIdx },
    });

    if (!existPost) {
      throw new BadRequestException('해당 게시글이 존재하지 않습니다.');
    }
    if (existPost.userIdx !== userIdx) {
      throw new BadRequestException('해당 게시글 수정 권한이 없습니다.');
    }

    const imageList = [];

    if (files) {
      const uploadImage = await this.uploadsService.uploadFileToS3(files);
      uploadImage.forEach((data) => {
        const key = data['key'].split('/');

        imageList.push(key[0]);
      });
    }

    const Chatimg = imageList.join(',');

    const updatePost: UpdateResult = await this.cardPostsRepository
      .createQueryBuilder()
      .update(CardPosts)
      .set({
        maincategory,
        category,
        title,
        desc,
        tag,
        imgUrl: Chatimg,
        pollType,
        pollTitle,
      })
      .where('postIdx = :postIdx AND userIdx = :userIdx', {
        postIdx,
        userIdx,
      })
      .execute();

    return updatePost;
  }

  /**
   * 8. 카드를 삭제합니다.
   * @param postIdx
   * @returns
   */
  async deletePost(userIdx: UUID, postIdx: UUID): Promise<void> {
    const exeistPost: CardPosts = await this.cardPostsRepository.findOne({
      where: { postIdx },
    });

    if (!exeistPost) {
      throw new BadRequestException('해당 게시글이 존재하지 않습니다.');
    } else if (exeistPost.userIdx !== userIdx) {
      throw new BadRequestException('해당 게시글 삭제 권한이 없습니다.');
    }

    const deletePost: DeleteResult = await this.cardPostsRepository
      .createQueryBuilder()
      .delete()
      .from(CardPosts)
      .where('postIdx = :postIdx AND userIdx = :userIdx', {
        userIdx,
        postIdx,
      })
      .execute();

    deletePost;
    return;
  }

  /**
   * 9. 지정 카드의 Img 배열을 가져옵니다.
   * @param postIdx
   * @returns
   */
  async findImg(postIdx: UUID): Promise<string[]> {
    const findImg: CardPosts = await this.cardPostsRepository.findOne({
      where: { postIdx },
      select: ['imgUrl'],
    });

    return findImg.imgUrl.split(',');
  }
}
