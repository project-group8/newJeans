import { Test, TestingModule } from '@nestjs/testing';
import { PostLikeService } from './post-like.service';
import { Repository } from 'typeorm';
import { PostLikes } from 'src/entities/PostLikes.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardPosts } from 'src/entities/CardPosts.entity';
import { BadRequestException } from '@nestjs/common';

const mockPostLikeEntitiy = () => ({
  postToggleLike: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('PostLikeService', () => {
  let postLikeservice: PostLikeService;
  let postLikesRepository: MockRepository<PostLikes>;
  let cardPostsRepository: MockRepository<CardPosts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostLikeService,
        {
          provide: getRepositoryToken(PostLikes),
          useValue: mockPostLikeEntitiy(),
        },
        {
          provide: getRepositoryToken(CardPosts),
          useValue: mockPostLikeEntitiy(),
        },
      ],
    }).compile();

    postLikesRepository = module.get<MockRepository<PostLikes>>(
      getRepositoryToken(PostLikes),
    );
    postLikeservice = module.get<PostLikeService>(PostLikeService);
    cardPostsRepository = module.get<MockRepository<CardPosts>>(
      getRepositoryToken(CardPosts),
    );
  });

  it('should be defined', () => {
    expect(postLikeservice).toBeDefined();
  });

  describe('postToggleLike', () => {
    it('게시글이 없는 경우', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        postLikeservice.postToggleLike(userIdx, postIdx),
      ).rejects.toThrow(BadRequestException);
    });

    it('성공적인 포스트 좋아요', async () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const saveInput = { userIdx, postIdx };

      const mockDataResult = '좋아요를 등록하였습니다.';

      jest.spyOn(cardPostsRepository, 'findOne').mockRejectedValueOnce(postIdx);
      jest.spyOn(postLikesRepository, 'findOne').mockRejectedValueOnce(null);
      jest.spyOn(postLikesRepository, 'save').mockRejectedValueOnce(saveInput);

      const testMethod = postLikeservice.postToggleLike(userIdx, postIdx);

      expect(testMethod).toEqual(mockDataResult);
    });

    it('post에 좋아요를 토글합니다.', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const mockDataResult = '좋아요를 취소하였습니다.';

      jest
        .spyOn(postLikeservice, 'postToggleLike')
        .mockResolvedValue(mockDataResult);

      const testMethod = await postLikeservice.postToggleLike(userIdx, postIdx);

      expect(testMethod).toEqual(mockDataResult);
      expect(postLikeservice.postToggleLike).toHaveBeenCalledWith(
        userIdx,
        postIdx,
      );
    });
  });
});
