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

@Entity({ name: 'PostLikes' })
export class PostLikes {
  @PrimaryGeneratedColumn('uuid')
  postLikeIdx: string;

  @Column({ type: 'uuid', nullable: false })
  userIdx: string;

  @Column({ type: 'uuid', nullable: false })
  postIdx: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //   @Column({ type: 'int' })
  //   UserId: number;

  //   @Column({ type: 'int' })
  //   PostId: number;

  //   // * Relation * /

  // *  PostLikes | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.Prefers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  PostLikes | M : 1 | CardPosts
  @ManyToOne(() => CardPosts, (cardPosts) => cardPosts.Prefers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'postIdx', referencedColumnName: 'postIdx' }])
  CardPosts: CardPosts;
}
