import { UUID } from 'crypto';

export class CommentLikeUpdateRequestDto {

  public commentIdx: UUID;

  public postIdx: UUID;

  public userIdx: UUID;
}