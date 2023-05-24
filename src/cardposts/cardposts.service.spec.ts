import { Test, TestingModule } from '@nestjs/testing';
import { CardpostsService } from './cardposts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardPosts } from '../entities/CardPosts.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  CardPostWithContents,
  CardPostWithIsLike,
  CreateCardDto,
  SplitCardsDto,
} from './dto/cardposts.dto';
import { Users } from '../entities/Users.entity';
import { Comments } from '../entities/Comments.entity';
import { UploadsService } from '../uploads/uploads.service';
import { BadRequestException } from '@nestjs/common';
import { OpenAIApi, Configuration } from 'openai';

const mockUploadsService = () => ({
  uploadFileToS3: jest.fn().mockResolvedValue([]),
  uploadFile: jest.fn(),
  downloadFile: jest.fn(),
});

const mockCardPostsEntity = () => ({
  findUser: jest.fn(),
  findSplitCards: jest.fn(),
  findOnePost: jest.fn(),
  findOnePostContents: jest.fn(),
  findOnePostCategorys: jest.fn(),
  postCard: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  findImg: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn().mockImplementation(() => ({})),
  save: jest.fn().mockResolvedValue(new Comments()),
});

jest.mock('openai', () => {
  return {
    OpenAIApi: jest.fn().mockImplementation(() => {
      return {
        createCompletion: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            data: {
              choices: [
                {
                  text: 'Mocked AI response',
                },
              ],
            },
          });
        }),
      };
    }),
    Configuration: jest.fn().mockImplementation(() => {
      return {
        // You may need to return some mock properties here if they are used in your code
      };
    }),
  };
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('CardpostsService', () => {
  let cardpostsService: CardpostsService;
  let cardPostsRepository: MockRepository<CardPosts>;
  let usersRepository: MockRepository<Users>;
  let commentsRepository: MockRepository<Comments>;
  let uploadsService: UploadsService;
  let openAIService: OpenAIApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardpostsService,
        {
          provide: getRepositoryToken(CardPosts),
          useValue: mockCardPostsEntity(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockCardPostsEntity(),
        },
        {
          provide: getRepositoryToken(Comments),
          useValue: mockCardPostsEntity(),
        },
        {
          provide: UploadsService,
          useValue: mockUploadsService(),
        },
        OpenAIApi,
      ],
    }).compile();

    cardpostsService = module.get<CardpostsService>(CardpostsService);
    cardPostsRepository = module.get<MockRepository<CardPosts>>(
      getRepositoryToken(CardPosts),
    );
    usersRepository = module.get<MockRepository<Users>>(
      getRepositoryToken(Users),
    );
    commentsRepository = module.get<MockRepository<Comments>>(
      getRepositoryToken(Comments),
    );
    uploadsService = module.get<UploadsService>(UploadsService);
    openAIService = module.get<OpenAIApi>(OpenAIApi);
  });

  it('should be defined', () => {
    expect(cardpostsService).toBeDefined();
  });

  describe('findSplitCards', () => {
    it('페이지 네이션으로 작동합니다.', async () => {
      const mockInput = {
        maincategory: '진지',
        category: '스포츠',
        splitNumber: 1,
        splitPageNumber: 1,
      };

      const mockDto = new SplitCardsDto();

      Object.assign(mockDto, mockInput);

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
        .spyOn(cardPostsRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            leftJoin: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await cardpostsService.findSplitCards(mockDto);

      expect(testMethod).toEqual(mockDataResult);
    });

    it('핫 훈수 카드로 작동합니다.', async () => {
      const mockInput = {};

      const mockDto = new SplitCardsDto();

      Object.assign(mockDto, mockInput);

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
        .spyOn(cardPostsRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            leftJoin: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await cardpostsService.findSplitCards(mockDto);

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('findUser', () => {
    it('email로 유저의 userIdx를 찾습니다.', async () => {
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

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

      const testMethod = await cardpostsService.findUser(email);

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('findOnePost', () => {
    it('로그인한 유저라면 포스트에 좋아요를 했는지 봅니다.', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const posetIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockDataResult = new CardPostWithIsLike();

      jest
        .spyOn(cardPostsRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            where: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            setParameter: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await cardpostsService.findOnePost(userIdx, posetIdx);

      expect(testMethod).toEqual(mockDataResult);
    });

    it('지정한 카드를 불러들입니다.', async () => {
      const userIdx = null;
      const posetIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockDataResult = new CardPostWithIsLike();

      jest
        .spyOn(cardPostsRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            where: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await cardpostsService.findOnePost(userIdx, posetIdx);

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('findOnePostContents', () => {
    it('지정한 카드의 Content를 가져옵니다.', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const posetIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockDataResult = new CardPostWithContents();

      jest
        .spyOn(cardPostsRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            where: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            setParameters: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(mockDataResult),
          };
          return qb;
        });

      const testMethod = await cardpostsService.findOnePostContents(
        userIdx,
        posetIdx,
      );
      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('findOnePostCategorys', () => {
    it('지정한 카드의 Category를 가져옵니다.', async () => {
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
        .spyOn(cardPostsRepository, 'findOne')
        .mockResolvedValue(mockCardpost);

      const testMethod = await cardpostsService.findOnePostCategorys(posetIdx);
      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('postCard', () => {
    it('카드를 생성합니다.', async () => {
      // Arrange
      const mockUUID =
        '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`;
      const mockCreateCardDto: CreateCardDto = new CreateCardDto();
      const mockFile: Express.Multer.File[] = []; // Update this with a real mock file if required
      const mockCardPosts: CardPosts = new CardPosts();

      jest.spyOn(uploadsService, 'uploadFileToS3').mockResolvedValue([]);

      // Act
      const result = await cardpostsService.postCard(
        mockUUID,
        mockCreateCardDto,
        mockFile,
      );

      // Assert
      expect(cardPostsRepository.save).toHaveBeenCalledWith({
        userIdx: mockUUID,
        maincategory: mockCreateCardDto.maincategory,
        category: mockCreateCardDto.category,
        title: mockCreateCardDto.title,
        desc: mockCreateCardDto.desc,
        tag: mockCreateCardDto.tag,
        imgUrl: '', // This is because no files are passed
        pollType: mockCreateCardDto.pollType,
        pollTitle: mockCreateCardDto.pollTitle,
      });

      expect(result).toEqual(mockCardPosts);
    });
  });

  describe('updatePost', () => {
    it('게시글을 수정하는데 해당 게시글이 존재하지 않습니다.', async () => {
      // Arrange
      const mockUUID =
        '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`;
      const mockpostIdx =
        '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`;
      const mockCreateCardDto: CreateCardDto = new CreateCardDto();
      const mockFile: Express.Multer.File[] = []; // Update this with a real mock file if required

      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValue(null);

      try {
        await cardpostsService.updatePost(
          mockUUID,
          mockpostIdx,
          mockCreateCardDto,
          mockFile,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('해당 게시글이 존재하지 않습니다.');
      }
      // Act
    });
    it('게시글을 수정하는데 해당 게시글이 수정 권한이 존재하지 않습니다.', async () => {
      // Arrange
      const mockUUID =
        '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`;
      const mockpostIdx =
        '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`;
      const mockCreateCardDto: CreateCardDto = new CreateCardDto();
      const mockFile: Express.Multer.File[] = []; // Update this with a real mock file if required

      jest
        .spyOn(cardPostsRepository, 'findOne')
        .mockResolvedValue(new CardPosts());

      try {
        await cardpostsService.updatePost(
          mockUUID,
          mockpostIdx,
          mockCreateCardDto,
          mockFile,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('해당 게시글 수정 권한이 없습니다.');
      }
      // Act
    });
    it('게시글을 수정합니다.', async () => {
      // Arrange
      const mockUUID =
        '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`;
      const mockpostIdx =
        '21c01d77-e275-4eea-bc97-209cb980415a' as `${string}-${string}-${string}-${string}-${string}`;
      const mockCreateCardDto: CreateCardDto = new CreateCardDto();
      const mockFile: Express.Multer.File[] = []; // Update this with a real mock file if required
      const mockCardPosts: CardPosts = new CardPosts();

      jest
        .spyOn(cardPostsRepository, 'findOne')
        .mockResolvedValue({ ...new CardPosts(), userIdx: mockUUID });
      jest.spyOn(uploadsService, 'uploadFileToS3').mockResolvedValue([]);
      jest.spyOn(cardPostsRepository, 'createQueryBuilder').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(mockCardPosts),
      });

      // Act
      const result = await cardpostsService.updatePost(
        mockUUID,
        mockpostIdx,
        mockCreateCardDto,
        mockFile,
      );

      expect(result).toEqual(mockCardPosts);
    });
  });

  describe('deletePost', () => {
    it('해당 게시글이 존재하지 않습니다.', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValue(null);
      try {
        await cardpostsService.deletePost(userIdx, postIdx);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('해당 게시글이 존재하지 않습니다.');
      }
    });

    it('해당 게시글 삭제 권한이 없습니다.', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const ortheruserIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';

      jest
        .spyOn(cardPostsRepository, 'findOne')
        .mockResolvedValue(ortheruserIdx);
      try {
        await cardpostsService.deletePost(userIdx, postIdx);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('해당 게시글 삭제 권한이 없습니다.');
      }
    });

    it('카드를 삭제합니다.', async () => {
      const userIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockobject = {
        userIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
        postIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
      };
      const mockCardpost = new CardPosts();
      Object.assign(mockCardpost, mockobject);

      const mockDataResult = undefined;
      jest
        .spyOn(cardPostsRepository, 'findOne')
        .mockResolvedValue(mockCardpost);
      jest
        .spyOn(cardPostsRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            delete: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(undefined),
          };
          return qb;
        });

      const testMethod = await cardpostsService.deletePost(userIdx, postIdx);

      expect(testMethod).toEqual(mockDataResult);
    });
  });

  describe('findImg', () => {
    it('지정 카드의 Img 배열을 가져옵니다.', async () => {
      const postIdx = '21c01d77-e275-4eea-bc97-209cb980415a';
      const mockDataResult = ['string'];
      const mockEntitiy = new CardPosts();
      const mockobject = {
        postIdx: '21c01d77-e275-4eea-bc97-209cb980415a',
        imgUrl: mockDataResult.join(','),
      };

      Object.assign(mockEntitiy, mockobject);

      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValue(mockEntitiy);

      const testMethod = await cardpostsService.findImg(postIdx);

      expect(testMethod).toEqual(mockDataResult);
    });
  });
});
