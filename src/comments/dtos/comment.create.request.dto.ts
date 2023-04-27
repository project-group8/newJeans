import { IsNotEmpty } from 'class-validator';
import { UUID } from 'crypto';

export class CommentCreateRequestDto {

  @IsNotEmpty()
  public comment: string;

  public selectedTag: string;

  public postIdx: UUID;

  public userIdx: UUID;
}