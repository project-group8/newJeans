import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prefers } from 'src/entities/Prefers.entity';
import { Repository, SelectQueryBuilder, createQueryBuilder } from 'typeorm';
import { CreatePollDto } from './dto/prefer.dto';
import { UUID } from 'crypto';
import { CardPosts } from 'src/entities/CardPosts.entity';

@Injectable()
export class PreferService {
  constructor(
    @InjectRepository(Prefers) private prefersRepository: Repository<Prefers>,
    @InjectRepository(CardPosts)
    private cardPostsRepository: Repository<CardPosts>,
  ) {}

  /**
   * 상세 페이지 투표결과 보기
   * @param postIdx
   * @returns
   */
  async postPollResult(postIdx: UUID): Promise<object> {
    const exeistPost = await this.cardPostsRepository.findOne({
      where: { postIdx },
    });
    if (!exeistPost) {
      throw new BadRequestException('해당 포스트가 존재하지 않습니다.');
    }

    const qb: SelectQueryBuilder<Prefers> = await this.prefersRepository
      .createQueryBuilder('p')
      .where('p.postIdx = :postIdx', { postIdx })
      .select([
        'COUNT(CASE WHEN p.selectprefer = 7 THEN 1 END) as proCount',
        'COUNT(CASE WHEN p.selectprefer = 8 THEN 1 END) as conCount',
      ]);

    return qb.getRawOne();
  }

  /**
   * //미완성 수정해야함
   * 상세 페이지 투표하기
   * @param postIdx
   * @param createPollDto
   * @returns
   */
  async createPostPoll(
    postIdx: UUID,
    createPollDto: CreatePollDto,
  ): Promise<number> {
    const { proInputValue, conInputValue } = createPollDto;
    const input: boolean = proInputValue || conInputValue;

    if (input) {
      const prefersRepository: Repository<Prefers> = await this
        .prefersRepository;
      const isPoll: Prefers = await prefersRepository
        .createQueryBuilder('prefer')
        .where(
          'prefer.postIdx = :postIdx AND prefer.selectprefer = :selectprefer',
          {
            postIdx,
            selectprefer: '7',
          },
        )
        .getOne();

      if (!isPoll) {
        await prefersRepository
          .createQueryBuilder()
          .insert()
          .into(Prefers)
          .values([{ postIdx }, {}])
          .execute();
      } else {
        await prefersRepository
          .createQueryBuilder()
          .delete()
          .from(Prefers)
          .where('postIdx = :postIdx', { postIdx })
          .execute();
      }

      const count = await prefersRepository
        .createQueryBuilder('p')
        .where('p.postIdx = :postIdx', { postIdx })
        .getCount();
      console.log(count);
      return count;
    }
  }
}
