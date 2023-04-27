import { UUID } from "crypto";

export class CommentDeleteRequestDto {
  public commentIdx: UUID;

  public userIdx: UUID;
}