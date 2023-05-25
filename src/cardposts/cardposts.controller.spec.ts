import { Test, TestingModule } from '@nestjs/testing';
import { CardpostsController } from './cardposts.controller';
import {
  CardPostsCategoryTransPipe,
  HotCardPostsMockPipe,
  CardPostCreateValidPipe,
} from './pipes/cardposts-category-trans.pipe';
import { CardpostsService } from './cardposts.service';
import {
  CardPostWithContents,
  CardPostWithIsLike,
  CreateCardDto,
  SplitCardsDto,
} from './dto/cardposts.dto';
import { CardPosts } from '../entities/CardPosts.entity';
import { UpdateResult } from 'typeorm';

const mockCardPostsController = {
  findSplitCards: jest.fn(),
  findOnePost: jest.fn(),
  findOnePostContents: jest.fn(),
  findOnePostCategorys: jest.fn(),
  postCard: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  findImg: jest.fn(),
};

describe('CardpostsController', () => {
  let cardPostscontroller: CardpostsController;
  let cardpostsService: CardpostsService;
  let cardPostCreateValidPipe: CardPostCreateValidPipe;
  let hotCardPostsMockPipe: HotCardPostsMockPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardpostsController],
      providers: [
        CardPostsCategoryTransPipe,
        HotCardPostsMockPipe,
        CardPostCreateValidPipe,
        { provide: CardpostsService, useValue: mockCardPostsController },
      ],
    }).compile();

    cardPostscontroller = module.get<CardpostsController>(CardpostsController);
    cardpostsService = module.get<CardpostsService>(CardpostsService);
    cardPostCreateValidPipe = module.get<CardPostCreateValidPipe>(
      CardPostCreateValidPipe,
    );
    hotCardPostsMockPipe =
      module.get<HotCardPostsMockPipe>(HotCardPostsMockPipe);
  });

  it('should be defined', () => {
    expect(cardPostscontroller).toBeDefined();
  });

  describe('findSplitCards', () => {
    it('페이지 네이션 기능.', async () => {
      const result: { postCards: object[] } = { postCards: [] };
      jest
        .spyOn(cardpostsService, 'findSplitCards')
        .mockResolvedValue(result.postCards);
      jest
        .spyOn(cardPostCreateValidPipe, 'transform')
        .mockImplementation((value) => value);

      expect(
        await cardPostscontroller.findSplitCards(new SplitCardsDto()),
      ).toEqual(result);
    });
    it('object타입을 확인합니다.', () => {
      expect(
        typeof cardPostscontroller.findSplitCards(new SplitCardsDto()),
      ).toBe('object');
    });
  });

  describe('findHotCards', () => {
    it('인기게시글 조회 기능.', async () => {
      const result: object[] = [];
      jest.spyOn(cardpostsService, 'findSplitCards').mockResolvedValue(result);

      expect(
        await cardPostscontroller.findHotCards(new SplitCardsDto()),
      ).toEqual({ postCards: result });
    });
  });

  describe('findOnePost', () => {
    it('상세페이지 조회', async () => {
      const result: { post: CardPostWithIsLike } = {
        post: new CardPostWithIsLike(),
      };
      const jwtPayload = null;
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardpostsService, 'findOnePost')
        .mockResolvedValue(new CardPostWithIsLike());

      expect(
        await cardPostscontroller.findOnePost(jwtPayload, postIdx),
      ).toEqual(result);
    });
  });

  describe('findOnePostContents', () => {
    it('상세페이지 Contents 조회', async () => {
      const result: { contents: CardPostWithContents } = {
        contents: new CardPostWithContents(),
      };
      const jwtPayload = null;
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardpostsService, 'findOnePostContents')
        .mockResolvedValue(new CardPostWithContents());

      expect(
        await cardPostscontroller.findOnePostContents(jwtPayload, postIdx),
      ).toEqual(result);
    });
  });

  describe('findOnePostCategorys', () => {
    it('상세페이지 Category 조회', async () => {
      const result = {};
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardpostsService, 'findOnePostCategorys')
        .mockResolvedValue(new Object());

      expect(await cardPostscontroller.findOnePostCategorys(postIdx)).toEqual(
        result,
      );
    });
  });

  describe('postCard', () => {
    it('게시글 작성하기', async () => {
      const result = { msg: '포스트 작성에 성공했습니다.' };
      const jwtPayload = {
        sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const createCardDto = new CreateCardDto();
      const files = [];

      jest
        .spyOn(cardpostsService, 'postCard')
        .mockResolvedValue(new CardPosts());

      expect(
        await cardPostscontroller.postCard(files, jwtPayload, createCardDto),
      ).toEqual(result);
    });
  });

  describe('updatePost', () => {
    it('게시글 수정하기', async () => {
      const result = { msg: '게시글 수정에 성공했습니다.' };
      const jwtPayload = {
        sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const createCardDto = new CreateCardDto();
      const files = [];

      jest
        .spyOn(cardpostsService, 'updatePost')
        .mockResolvedValue(new UpdateResult());

      expect(
        await cardPostscontroller.updatePost(
          files,
          jwtPayload,
          postIdx,
          createCardDto,
        ),
      ).toEqual(result);
    });
  });

  describe('deletePost', () => {
    it('게시글 삭제', async () => {
      const result = { msg: '게시글 삭제에 성공했습니다.' };
      const jwtPayload = {
        sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest.spyOn(cardpostsService, 'deletePost').mockResolvedValue(undefined);

      expect(await cardPostscontroller.deletePost(jwtPayload, postIdx)).toEqual(
        result,
      );
    });
  });

  describe('ImgArray', () => {
    it('지정 카드의 Img 배열을 가져옵니다.', async () => {
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockResult: string[] = ['newString'];

      jest.spyOn(cardpostsService, 'findImg').mockResolvedValue(mockResult);

      expect(await cardPostscontroller.findImg(postIdx)).toEqual({
        imgs: mockResult,
      });
    });
  });
});
