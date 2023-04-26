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
import { UUID } from 'crypto';
// import { ChatSaves } from './ChatSaves.entity';

@Entity({ name: 'Chats' })
export class Chats {
  @PrimaryGeneratedColumn('uuid')
  chatIdx: UUID;

  @Column({ type: 'uuid', nullable: false })
  userIdx: UUID;

  @Column({ type: 'int', nullable: false })
  maxParty: number;

  @Column({ type: 'varchar', nullable: false })
  roomName: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedAt: Date;

  //   // * Foreign Key * /

  //

  //   // * Relation * /

  // // *  Chats | 1 : M | ChatSaves
  // @OneToMany(() => ChatSaves, (chatSaves) => chatSaves.chatIdx, {
  //   cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // ChatSaves: ChatSaves[];

  // *  Chats | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.Chats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;
}
