import { Test, TestingModule } from '@nestjs/testing';
import { CardpostsService } from './cardposts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardPosts } from 'src/entities/CardPosts.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  CardPostWithContents,
  CardPostWithIsLike,
  CreateCardDto,
  SplitCardsDto,
} from './dto/cardposts.dto';
import { Users } from 'src/entities/Users.entity';

const mockChatEntity = {
  findUser: jest.fn(),
  findSplitCards: jest.fn(),
  findOnePost: jest.fn(),
  findOnePostContents: jest.fn(),
  findOnePostCategorys: jest.fn(),
  postCard: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  findImg: jest.fn(),
};
describe('CardpostsService', () => {
  let cardpostsService: CardpostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CardpostsService, useValue: mockChatEntity }],
    }).compile();

    cardpostsService = module.get<CardpostsService>(CardpostsService);
  });

  it('should be defined', () => {
    expect(cardpostsService).toBeDefined();
  });

  describe('findSplitCards', () => {
    it('findSplitCards', async () => {
      const splitCardsDto: SplitCardsDto = new SplitCardsDto();

      const mockDataResult: object[] = [
        {
          postIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
          maincategory: '21c01d77-e275-4eea-bc97-209cb980415a',
          category: '21c01d77-e275-4eea-bc97-209cb980415a',
          title: '21c01d77-e275-4eea-bc97-209cb980415a',
          desc: '21c01d77-e275-4eea-bc97-209cb980415a',
          nickname: '21c01d77-e275-4eea-bc97-209cb980415a',
          createdAt: new Date(),
          postViewCount: 1,
          isImg: 1,
          commentCount: '0',
          likesCount: '1',
        },
      ];

      jest
        .spyOn(cardpostsService, 'findSplitCards')
        .mockResolvedValue(mockDataResult);

      const testMethod = await cardpostsService.findSplitCards(splitCardsDto);

      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.findSplitCards).toHaveBeenCalledWith(
        splitCardsDto,
      );
    });
  });

  describe('findUser', () => {
    it('findUser', async () => {
      const email = '21c01d77-e275-4eea-bc97-209cb980415a';

      const mockDataResult = {
        userIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
        email: '21c01d77-e275-4eea-bc97-209cb980415a',
        password: '21c01d77-e275-4eea-bc97-209cb980415a',
        nickname: '21c01d77-e275-4eea-bc97-209cb980415a',
        provider: '21c01d77-e275-4eea-bc97-209cb980415a',
        level: '21c01d77-e275-4eea-bc97-209cb980415a',
        status: '21c01d77-e275-4eea-bc97-209cb980415a',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const mockUser = new Users();
      Object.assign(mockUser, mockDataResult);

      jest.spyOn(cardpostsService, 'findUser').mockResolvedValue(mockUser);

      const testMethod = await cardpostsService.findUser(email);

      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.findUser).toHaveBeenCalledWith(email);
    });
  });

  describe('findOnePost', () => {
    it('findOnePost', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const posetIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockDataResult = new CardPostWithIsLike();

      jest
        .spyOn(cardpostsService, 'findOnePost')
        .mockResolvedValue(mockDataResult);

      const testMethod = await cardpostsService.findOnePost(userIdx, posetIdx);

      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.findOnePost).toHaveBeenCalledWith(
        userIdx,
        posetIdx,
      );
    });
  });

  describe('findOnePostContents', () => {
    it('findOnePostContents', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const posetIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockDataResult = new CardPostWithContents();

      jest
        .spyOn(cardpostsService, 'findOnePostContents')
        .mockResolvedValue(mockDataResult);

      const testMethod = await cardpostsService.findOnePostContents(
        userIdx,
        posetIdx,
      );
      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.findOnePostContents).toHaveBeenCalledWith(
        userIdx,
        posetIdx,
      );
    });
  });

  describe('findOnePostCategorys', () => {
    it('findOnePostCategorys', async () => {
      const posetIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      const mockDataResult = {
        postIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
        userIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
        title: '21c01d77-e275-4eea-bc97-209cb980415a',
        pollType: '21c01d77-e275-4eea-bc97-209cb980415a',
        desc: '21c01d77-e275-4eea-bc97-209cb980415a',
        maincategory: '21c01d77-e275-4eea-bc97-209cb980415a',
        category: '21c01d77-e275-4eea-bc97-209cb980415a',
        tag: '21c01d77-e275-4eea-bc97-209cb980415a',
        imgUrl: '21c01d77-e275-4eea-bc97-209cb980415a',
        viewCount: 1,
        pollTitle: '21c01d77-e275-4eea-bc97-209cb980415a',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockCardpost = new Users();
      Object.assign(mockCardpost, mockDataResult);

      jest
        .spyOn(cardpostsService, 'findOnePostCategorys')
        .mockResolvedValue(mockCardpost);
      const testMethod = await cardpostsService.findOnePostCategorys(posetIdx);
      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.findOnePostCategorys).toHaveBeenCalledWith(
        posetIdx,
      );
    });
  });

  describe('postCard', () => {
    it('postCard', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const createCardDto = new CreateCardDto();
      const mockDataResult = new CardPosts();
      const files = [];

      jest
        .spyOn(cardpostsService, 'postCard')
        .mockResolvedValue(mockDataResult);
      const testMethod = await cardpostsService.postCard(
        userIdx,
        createCardDto,
        files,
      );
      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.postCard).toHaveBeenCalledWith(
        userIdx,
        createCardDto,
        files,
      );
    });
  });

  describe('updatePost', () => {
    it('updatePost', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const files = [];
      const createCardDto = new CreateCardDto();
      const mockDataResult: Promise<UpdateResult> = Promise.resolve({
        raw: [],
        affected: 1,
        generatedMaps: [],
      });

      jest
        .spyOn(cardpostsService, 'updatePost')
        .mockResolvedValue(mockDataResult);

      const testMethod = await cardpostsService.updatePost(
        userIdx,
        postIdx,
        createCardDto,
        files,
      );

      expect(testMethod).toEqual(await mockDataResult);
      expect(cardpostsService.updatePost).toHaveBeenCalledWith(
        userIdx,
        postIdx,
        createCardDto,
        files,
      );
    });
  });

  describe('deletePost', () => {
    it('deletePost', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      const mockDataResult = undefined;

      jest
        .spyOn(cardpostsService, 'deletePost')
        .mockResolvedValueOnce(mockDataResult);
      const testMethod = await cardpostsService.deletePost(userIdx, postIdx);
      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.deletePost).toHaveBeenCalledWith(
        userIdx,
        postIdx,
      );
    });
  });

  describe('findImg', () => {
    it('findImg', async () => {
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockDataResult = ['string'];

      jest.spyOn(cardpostsService, 'findImg').mockResolvedValue(mockDataResult);
      const testMethod = await cardpostsService.findImg(postIdx);

      expect(testMethod).toEqual(mockDataResult);
      expect(cardpostsService.findImg).toHaveBeenCalledWith(postIdx);
    });
  });
});
