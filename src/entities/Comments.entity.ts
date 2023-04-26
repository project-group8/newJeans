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
import { ReplyComments } from './ReplyComments.entity';
import { CommentLikes } from './CommentLikes.entity';
import { UUID } from 'crypto';

@Entity({ name: 'Comments' })
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  commentIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  userIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  postIdx: UUID;

  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @Column({ type: 'varchar', nullable: true, default: '' })
  selectedTag: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  Comments | 1 : M | CommentLikes
  @OneToMany(() => CommentLikes, (commentLikes) => commentLikes.Comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  CommentLikes: CommentLikes[];

  // *  Comments | 1 : M | ReplyComments
  @OneToMany(() => ReplyComments, (replyComments) => replyComments.Comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ReplyComments: ReplyComments[];

  // *  Comments | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.Comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  Comments | M : 1 | CardPosts
  @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.Comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  CardPosts: CardPosts;
}
