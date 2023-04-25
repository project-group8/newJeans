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
import { CardPosts } from './CardPosts';
import { ReplyComments } from './ReplyComments';
import { Chats } from './Chats';
import { ChatSaves } from './ChatSaves';

@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userIdx: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string; // Null을 허용해야함

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string; // 유니크 옵션

  @Column({ type: 'varchar', nullable: false })
  level: string = '훈수 초보'; // 디폴트 벨류 '훈수 초보'

  @Column({ type: 'varchar', nullable: false })
  status: string = 'US000001'; // 디폴트 벨류 "US000001"

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  Users | 1 : M | CommentsLikes
  @OneToMany(() => CommentLikes, (commentLikes) => commentLikes.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  CommentLikes: CommentLikes[];

  // *  Users | 1 : M | CardPosts
  @OneToMany(() => CardPosts, (cardPosts) => cardPosts.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  CardPosts: CardPosts[];

  // *  Users | 1 : M | Chats
  @OneToMany(() => Chats, (chats) => chats.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Chats: Chats[];

  // *  Users | 1 : M | Prefers
  @OneToMany(() => Prefers, (prefers) => prefers.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Prefers: Prefers[];

  // *  Users | 1 : M | PostLikes
  @OneToMany(() => PostLikes, (postLikes) => postLikes.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  PostLikes: PostLikes[];

  // *  Users | 1 : M | Comments
  @OneToMany(() => Comments, (comments) => comments.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Comments: Comments[];

  // *  Users | 1 : M | ReplyComments
  @OneToMany(() => ReplyComments, (replyComments) => replyComments.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ReplyComments: ReplyComments[];

  // *  Users | 1 : M | ChatSaves
  @OneToMany(() => ChatSaves, (chatSaves) => chatSaves.userIdx, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ChatSaves: ChatSaves[];
}
