import { UUID } from "crypto";

export class CommentGetRequestDto {

  public postIdx: UUID;

  public userIdx: UUID;
}