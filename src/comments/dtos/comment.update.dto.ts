import { IsNotEmpty } from 'class-validator';

export class CommentUpdateRequestDto {

  @IsNotEmpty()
  public comment: string;

  public id: number;

  public UserId: number;
}