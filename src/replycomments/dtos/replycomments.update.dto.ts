
import { IsNotEmpty } from 'class-validator';
import { UUID } from 'crypto';

export class ReplyCommentUpdateRequestDto {

  @IsNotEmpty()
  public comment: string;

  public replyIdx: UUID;

  public userIdx: UUID;
}