import { IsNotEmpty } from 'class-validator';
import { UUID } from 'crypto';

export class ReplyCommentCreateRequestDto {

  @IsNotEmpty()
  public comment: string;

  public commentIdx: UUID;

  public postIdx: UUID;

  public userIdx: UUID;
}