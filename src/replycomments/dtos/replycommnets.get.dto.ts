import { UUID } from "crypto";

export class ReplyCommentGetRequestDto {

  public postIdx: UUID;

  public commentIdx: UUID;

  public userIdx: UUID;
}