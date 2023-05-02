import { Test, TestingModule } from '@nestjs/testing';
import { PreferController } from './prefer.controller';
import { PreferService } from './prefer.service';
import { CreatePollValidPipe } from './pipes/prefer.pipe';
import { CreatePollDto } from './dto/prefer.dto';
// import * as request from 'supertest';
// import { INestApplication } from '@nestjs/common';

const mockPreferService = {
  postPollResult: jest.fn(),
  createPostPoll: jest.fn(),
};

describe('PreferController', () => {
  let preferController: PreferController;
  let preferService: PreferService;
  let createPollValidPipe: CreatePollValidPipe;
  // let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferController],
      providers: [
        CreatePollValidPipe,
        { provide: PreferService, useValue: mockPreferService },
      ],
    }).compile();

    // app = module.createNestApplication();
    // await app.init();

    preferController = module.get<PreferController>(PreferController);
    preferService = module.get<PreferService>(PreferService);
    createPollValidPipe = module.get<CreatePollValidPipe>(CreatePollValidPipe);
  });

  // afterAll(async () => {
  //   await app.close;
  // });

  it('should be defined', () => {
    expect(preferController).toBeDefined();
  });

  describe('postPollResult', () => {
    // it('/post/:postIdx (GET)', async () => {
    //   const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
    //   const response = await request(app.getHttpServer()).get(
    //     `/post/${postIdx}`,
    //   );
    //   return expect(response).toBe(200);
    // });
    it('투표 결과를 가져옵니다.', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const mockDataResult: object = { proCount: '0', conCount: '1' };
      jest
        .spyOn(preferController, 'postPollResult')
        .mockResolvedValue(mockDataResult);

      const testMethod: object = await preferController.postPollResult(postIdx);

      expect(testMethod).toEqual(mockDataResult);
      expect(preferController.postPollResult).toHaveBeenCalledWith(postIdx);
    });
  });

  describe('createPostPoll', () => {
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
        .spyOn(preferController, 'createPostPoll')
        .mockResolvedValue(mockDataResult.pollResult);
      jest
        .spyOn(createPollValidPipe, 'transform')
        .mockImplementation((value) => value);

      const testMethod = await preferController.createPostPoll(
        jwtPayload,
        postIdx,
        createPollDto,
      );

      expect({ pollResult: testMethod }).toEqual(mockDataResult);
      expect(preferController.createPostPoll).toHaveBeenCalledWith(
        jwtPayload,
        postIdx,
        createPollDto,
      );
    });
  });
});
