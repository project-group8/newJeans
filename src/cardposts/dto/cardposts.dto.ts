import { PickType } from '@nestjs/mapped-types';
import { CardPosts } from '../../entities/CardPosts.entity';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class SplitCardsDto extends PickType(CardPosts, [
  'maincategory',
  'category',
]) {
  @IsNotEmpty()
  @IsString()
  @Expose()
  splitNumber: number;
  @IsNotEmpty()
  @Expose()
  @IsString()
  splitPageNumber: number;
}
