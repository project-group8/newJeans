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

@Entity({ name: 'ReplyComments' })
export class ReplyComments {
  @PrimaryGeneratedColumn('uuid')
  replyIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  userIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  postIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  commentIdx: UUID;

  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  ReplyComments | M : 1 | Users
  // @ManyToOne(() => Users, (users) => users.ReplyComments, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  // Users: Users;

  @ManyToOne(() => Users, (users) => users.ReplyComments, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  ReplyComments | M : 1 | CardPosts
  // @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.ReplyComments, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  // CardPosts: CardPosts;

  @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.ReplyComments, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  CardPosts: CardPosts;

  // *  ReplyComments | M : 1 | Comments
  // @ManyToOne(() => Comments, (comments) => comments.ReplyComments, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'commentIdx', referencedColumnName: 'commentIdx' }])
  // Comments: Comments;

  @ManyToOne(() => Comments, (comments) => comments.ReplyComments, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'commentIdx', referencedColumnName: 'commentIdx' }])
  Comments: Comments;
}
