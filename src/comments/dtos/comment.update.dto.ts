
import { IsNotEmpty } from 'class-validator';
import { UUID } from 'crypto';

export class CommentUpdateRequestDto {

  @IsNotEmpty()
  public comment: string;

  public selectedTag: string;

  public postIdx: UUID;

  public commentIdx: UUID;

  public userIdx: UUID;
}