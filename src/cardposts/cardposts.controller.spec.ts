import { Test, TestingModule } from '@nestjs/testing';
import { CardpostsController } from './cardposts.controller';

describe('CardpostsController', () => {
  let controller: CardpostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardpostsController],
    }).compile();

    controller = module.get<CardpostsController>(CardpostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
