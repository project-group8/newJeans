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
//   import { CommentLikes } from './CommentsLikes';
//   import { Posts } from './Posts';
//   import { Users } from './Users';

@Entity({ name: 'comments' })
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  userIdx: string;

  @Column('text', { nullable: false })
  email: string;

  @Column('text', { nullable: true })
  password: string; // Null을 허용해야함

  @Column('text', { nullable: false, unique: true })
  nickname: string; // 유니크 옵션

  @Column('text', { nullable: false })
  level: string = '훈수 초보'; // 디폴트 벨류 '훈수 초보'

  @Column('text', { nullable: false })
  status: string = 'US000001'; // 디폴트 벨류 "US000001"

  @CreateDateColumn('timestamp')
  createdAt: Date;

  @UpdateDateColumn('timestamp')
  updatedAt: Date;

  //   // * Foreign Key * /

  //   @Column({ type: 'int' })
  //   UserId: number;

  //   @Column({ type: 'int' })
  //   PostId: number;
  //   // * Relation * /

  //   // *  Users | 1 : M | CommentsLikes
  //   @OneToMany(() => CommentLikes, (commentLikes) => commentLikes.Comment)
  //   CommentLikes: CommentLikes[];

  //   // *  PostLikes | M : 1 | Users
  //   @ManyToOne(() => Users, (users) => users.Comments, { onDelete: 'CASCADE' })
  //   @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  //   User: Users;

  //   // *  PostLikes | M : 1 | Posts
  //   @ManyToOne(() => Posts, (posts) => posts.Comments, { onDelete: 'CASCADE' })
  //   @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  //   Post: Posts;
}
