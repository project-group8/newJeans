import { PickType } from '@nestjs/mapped-types';
import { CardPosts } from '../../entities/CardPosts.entity';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

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

export class CardPostWithIsLike extends PickType(CardPosts, [
  'desc',
  'title',
  'createdAt',
  'postIdx',
]) {
  @Expose()
  @IsNumber()
  likesCount: number;

  @Expose()
  @IsNumber()
  commentCount: number;

  @Expose()
  @IsNumber()
  postViewCount: number;

  @Expose()
  @IsString()
  nickname: string;

  @Expose()
  @IsBoolean()
  IsLike: boolean;
}

export class CardPostWithContents extends PickType(CardPosts, [
  'pollType',
  'pollTitle',
  'tag',
]) {
  @Expose()
  @IsNumber()
  'conCount': number;

  @Expose()
  @IsNumber()
  'proCount': number;

  @Expose()
  @IsBoolean()
  'conInputValue': boolean;

  @Expose()
  @IsBoolean()
  'proInputValue': boolean;
}
