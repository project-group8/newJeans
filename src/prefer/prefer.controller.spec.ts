import { Test, TestingModule } from '@nestjs/testing';
import { PreferController } from './prefer.controller';
import { PreferService } from './prefer.service';
import { CreatePollValidPipe } from './pipes/prefer.pipe';
import { CreatePollDto } from './dto/prefer.dto';

const mockPreferService = {
  postPollResult: jest.fn(),
  createPostPoll: jest.fn(),
};

describe('PreferController', () => {
  let preferController: PreferController;
  let preferService: PreferService;
  let createPollValidPipe: CreatePollValidPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferController],
      providers: [
        CreatePollValidPipe,
        { provide: PreferService, useValue: mockPreferService },
      ],
    }).compile();

    preferController = module.get<PreferController>(PreferController);
    preferService = module.get<PreferService>(PreferService);
    createPollValidPipe = module.get<CreatePollValidPipe>(CreatePollValidPipe);
  });

  it('should be defined', () => {
    expect(preferController).toBeDefined();
  });

  describe('postPollResult', () => {
    it('투표 결과를 가져옵니다.', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const mockDataResult: object = { proCount: '0', conCount: '1' };

      jest
        .spyOn(preferController, 'postPollResult')
        .mockResolvedValue(mockDataResult);

      const testMethod: object = await preferController.postPollResult(postIdx);

      expect(testMethod).toEqual(mockDataResult);
    });

    it('투표 결과를 가져오는데 에러가 발생합니다', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';

      jest.spyOn(preferService, 'postPollResult').mockImplementation(() => {
        throw new Error('postPollResult에 에러 발생');
      });

      try {
        await preferController.postPollResult(postIdx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'postPollResult에 에러 발생');
      }
    });
  });

  describe('createPostPoll', () => {
    it('상세 페이지 에러가 발생합니다', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto: CreatePollDto = {
        proInputValue: true,
        conInputValue: false,
      };

      jest
        .spyOn(createPollValidPipe, 'transform')
        .mockImplementation((value) => value);
      jest.spyOn(preferService, 'createPostPoll').mockImplementation(() => {
        throw new Error('상세 페이지 에러가 발생합니다');
      });

      try {
        await preferController.createPostPoll(
          jwtPayload,
          postIdx,
          createPollDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty(
          'message',
          '상세 페이지 에러가 발생합니다',
        );
      }
    });

    it('상세 페이지에 투표합니다.', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const createPollDto: CreatePollDto = {
        proInputValue: true,
        conInputValue: false,
      };
      const mockDataResult = { pollResult: { proCount: '1', conCount: '0' } };

      jest
        .spyOn(preferService, 'createPostPoll')
        .mockResolvedValue(mockDataResult.pollResult);
      jest
        .spyOn(createPollValidPipe, 'transform')
        .mockImplementation((value) => value);

      const testMethod = await preferController.createPostPoll(
        jwtPayload,
        postIdx,
        createPollDto,
      );

      expect(testMethod).toEqual(mockDataResult);
    });
  });
});
