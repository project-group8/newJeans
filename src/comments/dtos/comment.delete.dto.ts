import { UUID } from "crypto";

export class CommentDeleteRequestDto {
  public commentIdx: UUID;

  public postIdx: UUID;

  public userIdx: UUID;
}