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
    it('should return 201 response code', async () => {
      const req: any = {}; // Mock request object
      const res: any = {
        statusCode: null,
        end: jest.fn(),
      };
      const next = jest.fn();

      jest
        .spyOn(cardPostscontroller, 'findSplitCards')
        .mockResolvedValue(undefined);

      await cardPostscontroller.findSplitCards(req);

      expect(res.statusCode).toBe(201);
      expect(res.end).toHaveBeenCalled();
    });

    it('findSplitCards', async () => {
      const result: { postCards: object[] } = { postCards: [] };
      jest
        .spyOn(cardPostscontroller, 'findSplitCards')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await cardPostscontroller.findSplitCards(new SplitCardsDto()),
      ).toEqual(result);
    });
    it('should have a object', () => {
      expect(
        typeof cardPostscontroller.findSplitCards(new SplitCardsDto()),
      ).toBe('object');
    });
  });

  describe('findHotCards', () => {
    it('findHotCards', async () => {
      const result: object[] = [];
      jest
        .spyOn(cardpostsService, 'findSplitCards')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await cardPostscontroller.findHotCards(new SplitCardsDto()),
      ).toEqual({ postCards: result });
    });
  });

  describe('findOnePost', () => {
    it('findOnePost', async () => {
      const result: { post: CardPostWithIsLike } = {
        post: new CardPostWithIsLike(),
      };
      const jwtPayload = null;
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardPostscontroller, 'findOnePost')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await cardPostscontroller.findOnePost(jwtPayload, postIdx),
      ).toEqual(result);
    });
  });

  describe('findOnePostContents', () => {
    it('findOnePostContents', async () => {
      const result: { contents: CardPostWithContents } = {
        contents: new CardPostWithContents(),
      };
      const jwtPayload = null;
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardPostscontroller, 'findOnePostContents')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await cardPostscontroller.findOnePostContents(jwtPayload, postIdx),
      ).toEqual(result);
    });
  });

  describe('findOnePostCategorys', () => {
    it('findOnePostCategorys', async () => {
      const result = {};
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardPostscontroller, 'findOnePostCategorys')
        .mockImplementation(() => Promise.resolve(result));

      expect(await cardPostscontroller.findOnePostCategorys(postIdx)).toEqual(
        result,
      );
    });
  });

  describe('postCard', () => {
    it('postCard', async () => {
      const result = { msg: '포스트 작성에 성공했습니다.' };
      const jwtPayload = {
        sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const createCardDto = new CreateCardDto();
      const files = [];

      jest
        .spyOn(cardPostscontroller, 'postCard')
        .mockImplementation(() => Promise.resolve(result));

      expect(
        await cardPostscontroller.postCard(files, jwtPayload, createCardDto),
      ).toEqual(result);
    });
  });

  describe('updatePost', () => {
    it('updatePost', async () => {
      const result = { msg: '게시글 수정에 성공했습니다.' };
      const jwtPayload = {
        sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const createCardDto = new CreateCardDto();
      const files = [];

      jest
        .spyOn(cardPostscontroller, 'updatePost')
        .mockImplementation(() => Promise.resolve(result));

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
    it('deletePost', async () => {
      const result = { msg: '게시글 삭제에 성공했습니다.' };
      const jwtPayload = {
        sub: '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardPostscontroller, 'deletePost')
        .mockImplementation(() => Promise.resolve(result));

      expect(await cardPostscontroller.deletePost(jwtPayload, postIdx)).toEqual(
        result,
      );
    });
  });
});
