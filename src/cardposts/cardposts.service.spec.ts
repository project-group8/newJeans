import { Test, TestingModule } from '@nestjs/testing';
import { CardpostsService } from './cardposts.service';

describe('CardpostsService', () => {
  let service: CardpostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardpostsService],
    }).compile();

    service = module.get<CardpostsService>(CardpostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
