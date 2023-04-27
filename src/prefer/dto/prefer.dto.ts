import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreatePollDto {
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  proInputValue: boolean;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  conInputValue: boolean;
}
