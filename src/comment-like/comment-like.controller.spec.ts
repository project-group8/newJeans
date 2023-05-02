import { Test, TestingModule } from '@nestjs/testing';
import { CommentLikeController } from './comment-like.controller';

describe('CommentLikeController', () => {
  let controller: CommentLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentLikeController],
    }).compile();

    controller = module.get<CommentLikeController>(CommentLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
