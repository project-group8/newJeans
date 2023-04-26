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
import { CommentLikes } from './CommentLikes.entity';
import { Prefers } from './Prefers.entity';
import { PostLikes } from './PostLikes.entity';
import { Comments } from './Comments.entity';
import { ReplyComments } from './ReplyComments.entity';
import { Users } from './Users.entity';
import { UUID } from 'crypto';

@Entity({ name: 'CardPosts' })
export class CardPosts {
  @PrimaryGeneratedColumn('uuid')
  postIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  userIdx: UUID;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  pollType: string; // Null을 허용해야함

  @Column({ type: 'varchar', nullable: false })
  desc: string;

  @Column({ type: 'varchar', nullable: false })
  maincategory: string;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  tag: string; // Null을 허용해야함

  @Column({ type: 'varchar', nullable: true, default: '' })
  imgUrl: string; // Null을 허용해야함

  @Column({ type: 'int', nullable: false })
  viewCount: number;

  @Column({ type: 'varchar', nullable: true, default: '' })
  pollTitle: string; // Null을 허용해야함

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  CardPosts | 1 : M | CommentLikes
  @OneToMany(() => CommentLikes, (commentLikes) => commentLikes.CardPosts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  CommentLikes: CommentLikes[];

  // *  CardPosts | 1 : M | Prefers
  @OneToMany(() => Prefers, (prefers) => prefers.CardPosts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Prefers: Prefers[];

  // *  CardPosts | 1 : M | PostLikes
  @OneToMany(() => PostLikes, (postLikes) => postLikes.CardPosts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  PostLikes: PostLikes[];

  // *  CardPosts | 1 : M | Comments
  @OneToMany(() => Comments, (comments) => comments.CardPosts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Comments: Comments[];

  // *  CardPosts | 1 : M | ReplyComments
  @OneToMany(() => ReplyComments, (replyComments) => replyComments.CardPosts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ReplyComments: ReplyComments[];

  // *  CardPosts | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.CardPosts, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;
}
