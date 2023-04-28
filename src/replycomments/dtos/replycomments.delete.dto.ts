import { UUID } from "crypto";

export class ReplyCommentDeleteRequestDto {
  public replyIdx: UUID;

  public userIdx: UUID;
}