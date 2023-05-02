import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prefers } from '../entities/Prefers.entity';
import { Repository, SelectQueryBuilder, createQueryBuilder } from 'typeorm';
import { CreatePollDto } from './dto/prefer.dto';
import { UUID } from 'crypto';
import { CardPosts } from '../entities/CardPosts.entity';

@Injectable()
export class PreferService {
  constructor(
    @InjectRepository(Prefers)
    private prefersRepository: Repository<Prefers>,
    @InjectRepository(CardPosts)
    private cardPostsRepository: Repository<CardPosts>,
  ) {}

  /**
   * 1. 상세 페이지 투표결과 보기
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
   *
   * 2. 상세 페이지 투표하기
   * @param postIdx
   * @param createPollDto
   * @returns
   */
  async createPostPoll(
    userIdx: UUID,
    postIdx: UUID,
    createPollDto: CreatePollDto,
  ) {
    const { proInputValue, conInputValue }: CreatePollDto = createPollDto;
    const input: boolean = proInputValue || conInputValue;
    const inputTransVal: string = proInputValue
      ? '7'
      : conInputValue
      ? '8'
      : null;

    if (input) {
      const isPoll: Prefers = await this.prefersRepository.findOne({
        where: { userIdx, postIdx },
      });

      if (isPoll) {
        const { selectprefer } = isPoll;

        if (selectprefer == '7' && conInputValue == true) {
          return '이미 찬성에 투표 했습니다.';
        } else if (selectprefer == '8' && proInputValue == true) {
          return '이미 반대에 투표 했습니다.';
        }
      }

      if (!isPoll) {
        await this.prefersRepository.save({
          userIdx,
          postIdx,
          selectprefer: inputTransVal,
        });
      } else {
        await this.prefersRepository
          .createQueryBuilder()
          .delete()
          .from(Prefers)
          .where(
            'postIdx = :postIdx AND userIdx = :userIdx AND selectprefer = :inputTransVal',
            { postIdx, userIdx, inputTransVal },
          )
          .execute();
      }

      const count = await this.prefersRepository
        .createQueryBuilder('p')
        .where('p.postIdx = :postIdx', { postIdx })
        .select([
          `COUNT(CASE WHEN p.selectprefer = 7 THEN 1 END) as proCount`,
          `COUNT(CASE WHEN p.selectprefer = 8 THEN 1 END) as conCount`,
        ])
        .getRawOne();

      return count;
    }
  }
}
