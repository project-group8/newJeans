import { Test, TestingModule } from '@nestjs/testing';
import { PostLikeService } from './post-like.service';
import { Repository } from 'typeorm';
import { PostLikes } from '../entities/PostLikes.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardPosts } from '../entities/CardPosts.entity';
import { BadRequestException } from '@nestjs/common';

const mockPostLikeEntitiy = () => ({
  postToggleLike: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockImplementation(() => ({
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
  })),
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

      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValueOnce(postIdx);
      jest.spyOn(postLikesRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(postLikesRepository, 'save').mockResolvedValueOnce(saveInput);

      const testMethod = await postLikeservice.postToggleLike(userIdx, postIdx);

      expect(testMethod).toEqual(mockDataResult);
    });

    it('post에 좋아요를 토글합니다.', async () => {
      const userIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const mockDataResult = '좋아요를 취소하였습니다.';
      const deleteMock = jest.fn().mockReturnThis();

      jest.spyOn(cardPostsRepository, 'findOne').mockResolvedValue(postIdx);
      jest.spyOn(postLikesRepository, 'findOne').mockResolvedValue(postIdx);
      jest.spyOn(postLikesRepository, 'createQueryBuilder').mockReturnValue({
        delete: deleteMock,
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
        getRawOne: jest.fn().mockResolvedValue(undefined),
      });

      const testMethod = await postLikeservice.postToggleLike(userIdx, postIdx);

      expect(testMethod).toEqual(mockDataResult);
      expect(deleteMock).toHaveBeenCalled();
    });
  });
});
