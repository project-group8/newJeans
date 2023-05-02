import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users.entity';
import { CardPosts } from './CardPosts.entity';
import { Comments } from './Comments.entity';
import { UUID } from 'crypto';

@Entity({ name: 'CommentLikes' })
export class CommentLikes {
  @PrimaryGeneratedColumn('uuid')
  commentLikeIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  userIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  postIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  commentIdx: UUID;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  CommentLikes | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.CommentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  CommentLikes | M : 1 | Comments
  @ManyToOne(() => Comments, (comments) => comments.CommentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'commentIdx', referencedColumnName: 'commentIdx' }])
  Comments: Comments;

  // *  CommentLikes | M : 1 | CardPosts
  @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.CommentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  CardPosts: CardPosts;
}
