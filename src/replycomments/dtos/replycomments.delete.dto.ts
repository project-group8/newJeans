import { UUID } from "crypto";

export class ReplyCommentDeleteRequestDto {

  public replyIdx: UUID;

  public postIdx: UUID;

  public commentIdx: UUID;

  public userIdx: UUID;
}