import { PickType } from '@nestjs/mapped-types';
import { CardPosts } from '../../entities/CardPosts.entity';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class SplitCardsDto extends PickType(CardPosts, [
  'maincategory',
  'category',
]) {
  @IsString()
  @Expose()
  splitNumber: number;

  @Expose()
  @IsString()
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
