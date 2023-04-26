import { UUID } from 'crypto';
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

@Entity({ name: 'ChatSaves' })
export class ChatSaves {
  @PrimaryGeneratedColumn()
  chatSaveIdx: UUID;

  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @Column({ type: 'varchar', nullable: false })
  room: string;

  @Column({ type: 'varchar', nullable: false })
  saveData: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // // *  ChatSaves | M : 1 | Users
  // @ManyToOne(() => Users, (users) => users.ChatSaves, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  // Users: Users;

  // // *  ChatSaves | M : 1 | Chats
  // @ManyToOne(() => Chats, (chats) => chats.ChatSaves, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn([{ name: 'chatIdx', referencedColumnName: 'chatIdx' }])
  // Chats: Chats;
}
