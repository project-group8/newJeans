import { UUID } from 'crypto';
import { Users } from './Users.entity';
import {
Column,
CreateDateColumn,
DeleteDateColumn,
Entity,
JoinColumn,
ManyToOne,
PrimaryGeneratedColumn,
UpdateDateColumn,
OneToOne,
} from 'typeorm';

@Entity({ name: 'Tokens' })
export class Tokens {
@PrimaryGeneratedColumn('uuid')
tokenIdx: UUID;

@Column({ type: 'uuid', nullable: false })
userIdx: UUID;

@Column({ type: 'text' })
token: string;

@CreateDateColumn({ type: 'timestamp' })
createdAt: Date;

@UpdateDateColumn({ type: 'timestamp' })
updatedAt: Date;

@DeleteDateColumn({ type: 'timestamp' })
deletedAt: Date | null;

// * Foreign Key * /

// * Relation * /

// * Tokens | 1 : 1 | Users

// @OneToOne(() => Users)
// @JoinColumn({ name: 'userIdx', referencedColumnName: 'userIdx' })
// Users: Users;

@OneToOne(() => Users, (users) => users.Tokens, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
  Users: Users;

// @ManyToOne(() => Users, (users) => users.Tokens, {
// onDelete: 'CASCADE',
// })
// @JoinColumn([{ name: 'userIdx', referencedColumnName: 'userIdx' }])
// Users: Users;
}