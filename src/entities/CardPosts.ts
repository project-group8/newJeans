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
import { CommentLikes } from './CommentLikes';
import { Prefers } from './Prefers';
import { PostLikes } from './PostLikes';
import { Comments } from './Comments';
import { ReplyComments } from './ReplyComments';
import { Users } from './Users';

@Entity({ name: 'CardPosts' })
export class CardPosts {
  @PrimaryGeneratedColumn('uuid')
  postIdx: string;

  @Column({ type: 'uuid', nullable: false })
  userIdx: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  pollType: string = ''; // Null을 허용해야함

  @Column({ type: 'varchar', nullable: false })
  desc: string;

  @Column({ type: 'varchar', nullable: false })
  maincategory: string;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  tag: string = ''; // Null을 허용해야함

  @Column({ type: 'varchar', nullable: true })
  imgUrl: string = ''; // Null을 허용해야함

  @Column({ type: 'int', nullable: false })
  viewCount: number;

  @Column({ type: 'varchar', nullable: true })
  pollTitle: string = ''; // Null을 허용해야함

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  @OneToMany(() => CommentLikes, (commentLikes) => commentLikes.postIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  CommentLikes: CommentLikes[];

  // *  CardPosts | 1 : M | Prefers
  @OneToMany(() => Prefers, (prefers) => prefers.postIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Prefers: Prefers[];

  // *  CardPosts | 1 : M | PostLikes
  @OneToMany(() => PostLikes, (postLikes) => postLikes.postIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  PostLikes: PostLikes[];

  // *  CardPosts | 1 : M | Comments
  @OneToMany(() => Comments, (comments) => comments.postIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Comments: Comments[];

  // *  CardPosts | 1 : M | ReplyComments
  @OneToMany(() => ReplyComments, (replyComments) => replyComments.postIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ReplyComments: ReplyComments[];

  // *  CardPosts | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.CardPosts, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;
}
