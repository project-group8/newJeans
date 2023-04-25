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
import { Chats } from './Chats';

@Entity({ name: 'ChatSaves' })
export class ChatSaves {
  @PrimaryGeneratedColumn('uuid')
  chatSaveIdx: string;

  @Column({ type: 'uuid', nullable: false })
  chatIdx: string;

  @Column({ type: 'uuid', nullable: false })
  userIdx: string;

  @Column({ type: 'varchar', nullable: false })
  saveData: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // *  ChatSaves | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.ChatSaves, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

  // *  ChatSaves | M : 1 | Chats
  @ManyToOne(() => Chats, (chats) => chats.ChatSaves, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'chatIdx', referencedColumnName: 'chatIdx' }])
  Chats: Chats;
}
