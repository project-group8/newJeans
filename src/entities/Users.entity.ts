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
import { CardPosts } from './CardPosts.entity';
import { ReplyComments } from './ReplyComments.entity';
import { Chats } from './Chats.entity';
import { ChatSaves } from './ChatSaves.entity';

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
  
  @Column({ type: 'varchar', length: 6, nullable: true })
  provider: string;

  @Column({ type: 'varchar', nullable: false, default: '훈수 초보' })
  level: string; // 디폴트 벨류 '훈수 초보'

  @Column({ type: 'varchar', nullable: false, default: 'US000001' })
  status: string; // 디폴트 벨류 "US000001"

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  Users | 1 : M | CommentsLikes
  @OneToMany(() => CommentLikes, (commentLikes) => commentLikes.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  CommentLikes: CommentLikes[];

  // *  Users | 1 : M | CardPosts
  @OneToMany(() => CardPosts, (cardPosts) => cardPosts.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  CardPosts: CardPosts[];

  // *  Users | 1 : M | Chats
  @OneToMany(() => Chats, (chats) => chats.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Chats: Chats[];

  // *  Users | 1 : M | Prefers
  @OneToMany(() => Prefers, (prefers) => prefers.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Prefers: Prefers[];

  // *  Users | 1 : M | PostLikes
  @OneToMany(() => PostLikes, (postLikes) => postLikes.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  PostLikes: PostLikes[];

  // *  Users | 1 : M | Comments
  @OneToMany(() => Comments, (comments) => comments.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Comments: Comments[];

  // *  Users | 1 : M | ReplyComments
  @OneToMany(() => ReplyComments, (replyComments) => replyComments.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ReplyComments: ReplyComments[];

  // *  Users | 1 : M | ChatSaves
  @OneToMany(() => ChatSaves, (chatSaves) => chatSaves.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ChatSaves: ChatSaves[];
}
