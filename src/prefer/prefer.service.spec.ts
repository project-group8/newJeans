import { Test, TestingModule } from '@nestjs/testing';
import { PreferService } from './prefer.service';
import { Repository } from 'typeorm';
import { Prefers } from 'src/entities/Prefers.entity';

const mockPreferEntity = {
  findOne: jest.fn(),
};
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('PreferService', () => {
  let preferService: PreferService;
  let prefersRepository: MockRepository<Prefers>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreferService,
        { provide: 'Prefer_PrefersRepository', useValue: prefersRepository },
      ],
    }).compile();

    prefersRepository = module.get<MockRepository<Prefers>>(
      'Prefer_PrefersRepository',
    );
    preferService = module.get<PreferService>(PreferService);
  });

  it('should be defined', () => {
    expect(preferService).toBeDefined();
  });

  describe('postPollResult', () => {
    it('상세페이지의 투표 결과를 봅니다.', () => {
      const postIdx = 'fd05b208-12c3-4b6c-bd8e-eea8e5e202c9';
      const data: object = { proCount: '0', conCount: '1' };

      jest.spyOn(prefersRepository, 'findOne').mockResolvedValue(postIdx);
      jest
        .spyOn(prefersRepository, 'createQueryBuilder')
        .mockResolvedValue(postIdx);

      // expect().toEqual();
    });
  });
});
