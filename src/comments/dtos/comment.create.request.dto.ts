import { IsNotEmpty } from 'class-validator';
import { UUID } from 'crypto';

export class CommentCreateRequestDto {

  @IsNotEmpty()
  public comment: string;

  public target: number;

  public postIdx: UUID;

  public userIdx: UUID;
}