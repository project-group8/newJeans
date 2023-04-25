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

@Entity({ name: 'ReplyComments' })
export class ReplyComments {
  @PrimaryGeneratedColumn('uuid')
  replyIdx: string;

  @Column({ type: 'uuid', nullable: false })
  userIdx: string;

  @Column({ type: 'uuid', nullable: false })
  postIdx: string;

  @Column({ type: 'uuid', nullable: false })
  commentIdx: string;

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
  @ManyToOne(() => Users, (users) => users.ReplyComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  ReplyComments | M : 1 | CardPosts
  @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.ReplyComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  CardPosts: CardPosts;

  // *  ReplyComments | M : 1 | Comments
  @ManyToOne(() => Comments, (comments) => comments.ReplyComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'commentIdx', referencedColumnName: 'commentIdx' }])
  Comments: Comments;
}
