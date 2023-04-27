import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prefers } from 'src/entities/Prefers.entity';
import { Repository } from 'typeorm';

export class CreatePollValidPipe implements PipeTransform {
  constructor(
    @InjectRepository(Prefers)
    private prefersRepository: Repository<Prefers>,
  ) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    value.proInputValue = Boolean(value.proInputValue);
    value.conInputValue = Boolean(value.conInputValue);

    if (!this.isValid(value)) {
      throw new BadRequestException(
        '입력 과정에서 알 수 없는 오류가 발생했습니다.',
      );
    }

    // const findPollUserCheckValue: Prefers =
    //   await this.prefersRepository.findOne({}); // 미완성 유저추가 해야함

    // if (findPollUserCheckValue) {
    //   const { selectprefer } = findPollUserCheckValue;

    //   if (selectprefer == '7' && value.conInputValue == true) {
    //     return '이미 찬성에 투표 했습니다.';
    //   } else if (selectprefer == '8' && value.proInputValue == true) {
    //     return '이미 반대에 투표 했습니다.';
    //   }
    // }

    return value;
  }

  private isValid(value) {
    const { proInputValue, conInputValue } = value;

    if (proInputValue == null || conInputValue == null) {
      throw new BadRequestException(
        'proInputValue, conInputValue은 비어있을 수 없습니다.',
      );
    }

    if (
      typeof proInputValue !== 'boolean' ||
      typeof conInputValue !== 'boolean'
    ) {
      throw new BadRequestException(
        'proInputValue, conInputValue 타입이 올바르지 않습니다. boolean 타입이어야 합니다.',
      );
    }

    if (proInputValue == true && conInputValue == true) {
      throw new BadRequestException(
        'proInputValue, conInputValue은 둘다 true 일 수 없습니다.',
      );
    }

    return true;
  }
}
