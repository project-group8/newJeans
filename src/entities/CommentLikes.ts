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
import { Users } from './Users';
import { CardPosts } from './CardPosts';
import { Comments } from './Comments';

@Entity({ name: 'CommentLikes' })
export class CommentLikes {
  @PrimaryGeneratedColumn('uuid')
  commentLikeIdx: string;

  @Column({ type: 'uuid', nullable: false })
  userIdx: string;

  @Column({ type: 'uuid', nullable: false })
  postIdx: string;

  @Column({ type: 'uuid', nullable: false })
  commentIdx: string;

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
