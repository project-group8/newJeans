import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class CardPostsCategoryTrans implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.category = value.category === '전체' ? null : value.category;
    value.maincategory =
      value.maincategory === '전체' ? null : value.maincategory;
    value.splitNumber = parseInt(value.splitNumber, 10);
    value.splitPageNumber = parseInt(value.splitPageNumber, 10);

    return value;
  }
}
