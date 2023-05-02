import { Test, TestingModule } from '@nestjs/testing';
import { PreferService } from './prefer.service';
import { Repository } from 'typeorm';
import { Prefers } from 'src/entities/Prefers.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardPosts } from 'src/entities/CardPosts.entity';
import { CreatePollDto } from './dto/prefer.dto';
import { BadRequestException } from '@nestjs/common';

const mockPreferEntity = () => ({
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
});
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('PreferService', () => {
  let preferService: PreferService;
  let cardPostsRepository: MockRepository<CardPosts>;
  let prefersRepository: MockRepository<Prefers>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferService,
        { provide: getRepositoryToken(Prefers), useValue: mockPreferEntity() },
        {
          provide: getRepositoryToken(CardPosts),
          useValue: mockPreferEntity(),
        },
      ],
    }).compile();

    cardPostsRepository = module.get<MockRepository<CardPosts>>(
      getRepositoryToken(CardPosts),
    );
    prefersRepository = module.get<MockRepository<Prefers>>(
      getRepositoryToken(Prefers),
    );
    preferService = module.get<PreferService>(PreferService);
  });

  it('should be defined', () => {
    expect(preferService).toBeDefined();
  });

  describe('postPollResult', () => {
    it('post가 존재하지 않는 에러', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(preferService.postPollResult(postIdx)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('상세페이지의 투표 결과를 봅니다.', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';

      const data: object = { proCount: '0', conCount: '1' };

      jest
        .spyOn(cardPostsRepository, 'findOne')
        .mockResolvedValue({ postIdx } as any);
      jest
        .spyOn(prefersRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            where: () => qb,
            select: () => qb,
            getRawOne: () => Promise.resolve(data),
          };
          return qb;
        });
      const exeistPost = await preferService.postPollResult(postIdx);
      expect(exeistPost).toEqual(data);
    });

    it('성공적인 포스트 가져오기', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const expectedResult = { proCount: 5, conCount: 3 };

      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValueOnce({
        postIdx,
      } as any);
      jest
        .spyOn(prefersRepository, 'createQueryBuilder')
        .mockImplementationOnce(() => {
          const qb: any = {
            where: () => qb,
            select: () => qb,
            getRawOne: () => Promise.resolve(expectedResult),
          };
          return qb;
        });

      const result = await preferService.postPollResult(postIdx);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createPostPoll', () => {
    it('상세 페이지에 투표합니다.', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto: CreatePollDto = {
        proInputValue: true,
        conInputValue: false,
      };
      const mockPollResult = { pollResult: { proCount: '1', conCount: '0' } };

      jest
        .spyOn(preferService, 'createPostPoll')
        .mockResolvedValue(mockPollResult);

      const testResult = await preferService.createPostPoll(
        userIdx,
        postIdx,
        createPollDto,
      );

      expect(testResult).toEqual(mockPollResult);
      expect(preferService.createPostPoll).toHaveBeenCalledWith(
        userIdx,
        postIdx,
        createPollDto,
      );
    });
  });
});
