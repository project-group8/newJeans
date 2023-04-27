import { PickType } from '@nestjs/mapped-types';
import { CardPosts } from '../../entities/CardPosts.entity';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SplitCardsDto extends PickType(CardPosts, [
  'maincategory',
  'category',
]) {
  @IsNumber()
  @Expose()
  splitNumber: number;

  @Expose()
  @IsNumber()
  splitPageNumber: number;
}

export class CreateCardDto extends PickType(CardPosts, [
  'title',
  'maincategory',
  'category',
  'desc',
  'pollType',
  'pollTitle',
  'tag',
  'imgUrl',
]) {}
