import { Test, TestingModule } from '@nestjs/testing';
import { PreferService } from './prefer.service';
import { Repository } from 'typeorm';
import { Prefers } from '../entities/Prefers.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardPosts } from '../entities/CardPosts.entity';
import { CreatePollDto } from './dto/prefer.dto';
import { BadRequestException } from '@nestjs/common';

const mockPreferEntity = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockImplementation(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
    select: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue(undefined),
  })),
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
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(expectedResult),
          };
          return qb;
        });

      const result = await preferService.postPollResult(postIdx);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createPostPoll', () => {
    it('이미 반대에 투표한 사람이 찬성에 투표하려는 경우', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto = { proInputValue: true, conInputValue: false };
      const poll = { selectprefer: '8' };

      jest.spyOn(prefersRepository, 'findOne').mockResolvedValue(poll);

      const result = await preferService.createPostPoll(
        userIdx,
        postIdx,
        createPollDto,
      );

      expect(result).toEqual('이미 반대에 투표 했습니다.');
    });

    it('이미 찬성에 투표한 사람이 반대에 투표하려는 경우', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto = { proInputValue: false, conInputValue: true };
      const poll = { selectprefer: '7' };

      jest.spyOn(prefersRepository, 'findOne').mockResolvedValue(poll);

      const result = await preferService.createPostPoll(
        userIdx,
        postIdx,
        createPollDto,
      );

      expect(result).toEqual('이미 찬성에 투표 했습니다.');
    });

    it('투표에 반대한 유저가 반대표를 취소하는 경우', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto = { proInputValue: false, conInputValue: true };
      const poll = { selectprefer: '8' };
      const deleteMock = jest.fn().mockReturnThis();

      jest.spyOn(prefersRepository, 'findOne').mockResolvedValue(poll);
      jest.spyOn(prefersRepository, 'createQueryBuilder').mockReturnValue({
        delete: deleteMock,
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      });

      await preferService.createPostPoll(userIdx, postIdx, createPollDto);

      expect(deleteMock).toHaveBeenCalled();
    });

    it('투표에 찬성한 유저가 찬성표를 취소하는 경우', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto = { proInputValue: true, conInputValue: false };
      const poll = { selectprefer: '7' };
      const deleteMock = jest.fn().mockReturnThis();

      jest.spyOn(prefersRepository, 'findOne').mockResolvedValue(poll);
      jest.spyOn(prefersRepository, 'createQueryBuilder').mockReturnValue({
        delete: deleteMock,
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      });

      await preferService.createPostPoll(userIdx, postIdx, createPollDto);

      expect(deleteMock).toHaveBeenCalled();
    });

    it('투표를 하지 않았다면 투표를 하고 결과를', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto = { proInputValue: true, conInputValue: false };
      const count = {
        /* mock count result */
      };

      jest.spyOn(prefersRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(prefersRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(prefersRepository, 'createQueryBuilder').mockImplementation(
        () =>
          ({
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            getRawOne: jest.fn().mockResolvedValue(count),
          } as any),
      );

      const result = await preferService.createPostPoll(
        userIdx,
        postIdx,
        createPollDto,
      );

      expect(result).toEqual(count);
    });
  });
});
