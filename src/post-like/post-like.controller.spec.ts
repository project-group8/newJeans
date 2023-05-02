import { Test, TestingModule } from '@nestjs/testing';
import { PostLikeController } from './post-like.controller';
import { PostLikeService } from './post-like.service';

const mockPostLikeController = {
  postToggleLike: jest.fn(),
};

describe('PostLikeController', () => {
  let postLikecontroller: PostLikeController;
  let postLikeService: PostLikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostLikeController],
      providers: [
        { provide: PostLikeService, useValue: mockPostLikeController },
      ],
    }).compile();

    postLikecontroller = module.get<PostLikeController>(PostLikeController);
    postLikeService = module.get<PostLikeService>(PostLikeService);
  });

  it('should be defined', () => {
    expect(postLikecontroller).toBeDefined();
  });

  describe('postToggleLike', () => {
    it('post에 좋아요를 토글합니다.', async () => {
      const jwtPayload = {
        sub: 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9' as `${string}-${string}-${string}-${string}-${string}`,
      };

      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const mockdataResult = '좋아요를 등록하였습니다.';

      jest
        .spyOn(postLikecontroller, 'postToggleLike')
        .mockResolvedValue({ message: mockdataResult });

      const testMethod = await postLikecontroller.postToggleLike(
        jwtPayload,
        postIdx,
      );

      expect(testMethod).toEqual({ message: mockdataResult });
      expect(postLikecontroller.postToggleLike).toHaveBeenCalledWith(
        jwtPayload,
        postIdx,
      );
    });
  });
});
