import {
  ArgumentMetadata,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

export class CardPostsCategoryTransPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): object {
    const isValid = this.validate(value);

    if (!isValid) {
      throw new BadRequestException(
        '페이지 네이션, 쿼리스트링 입력에서 알 수 없는 오류가 발생했습니다.',
      );
    }

    const { category, maincategory, splitNumber, splitPageNumber } = value;

    value.category = category === '전체' ? null : category;
    value.maincategory = maincategory === '전체' ? null : maincategory;
    value.splitNumber = parseInt(splitNumber, 10);
    value.splitPageNumber = parseInt(splitPageNumber, 10);

    return value;
  }

  private validate(value: any): boolean {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new BadRequestException(
        'category, maincategory, splitNumber, splitPageNumber는 비어있을 수 없습니다.',
      );
    }

    const keys = Object.keys(value);
    if (keys.length !== 4) {
      throw new BadRequestException(
        'category, maincategory, splitNumber, splitPageNumber는 비어있을 수 없습니다.',
      );
    }

    for (const key of keys) {
      const element = value[key];

      if (element === null || element === undefined) {
        throw new BadRequestException(
          'category, maincategory, splitNumber, splitPageNumber는 비어있을 수 없습니다.',
        );
      }

      if (typeof element !== 'string' && typeof element !== 'number') {
        throw new BadRequestException(
          'category, maincategory, splitNumber, splitPageNumber의 타입을 확인하세요.',
        );
      }
    }

    return true;
  }
}

export class HotCardPostsMockPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.category = null;
    value.maincategory = null;
    value.splitNumber = null;
    value.splitPageNumber = null;

    return value;
  }
}

export class CardPostCreateValidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValid(value)) {
      throw new BadRequestException(
        '데이터 입력에서 알 수 없는 오류가 발생했습니다.',
      );
    }
    return value;
  }

  private isValid(value): boolean {
    const {
      title,
      maincategory,
      category,
      desc,
      pollTitle = null,
      pollType = null,
      tag = null,
    } = value;
    if (
      title === null ||
      maincategory === null ||
      category === null ||
      desc === null
    ) {
      throw new BadRequestException(
        'title, maincategory, category, desc는 비워 둘 수 없습니다.',
      );
    }

    if (
      typeof title !== 'string' ||
      typeof maincategory !== 'string' ||
      typeof category !== 'string' ||
      typeof desc !== 'string'
    ) {
      throw new BadRequestException(
        '게시글 작성의 입력 타입에 오류가 있습니다.',
      );
    }

    if (title.length > 25) {
      throw new BadRequestException('title은 25자를 넘을 수 없습니다.');
    }

    if (desc.length > 1500) {
      throw new BadRequestException('desc는 1500를 넘을 수 없습니다.');
    }

    if (typeof pollType !== null && typeof pollType !== 'string') {
      throw new BadRequestException('pollType 타입에 오류가 있습니다.');
    }

    if (typeof pollTitle !== null && typeof pollTitle !== 'string') {
      throw new BadRequestException('pollTitle 타입에 오류가 있습니다.');
    }

    if (typeof tag !== null && typeof tag !== 'string') {
      throw new BadRequestException('tag 타입에 오류가 있습니다.');
    }

    return true;
  }
}
