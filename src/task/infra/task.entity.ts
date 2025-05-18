import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TaskStatus } from '../domain/task-status.enum';
import { UserEntity } from '../../user/infra/user.entity'; // Adjust the import path as needed

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('increment', { unsigned: true, type: 'bigint' })
  public id?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public title: string;

  @Column({ type: 'text', nullable: true })
  public description?: string;

  @Column({ type: 'enum', enum: TaskStatus, nullable: false })
  public status: TaskStatus;

  @Column({ type: 'timestamptz', nullable: false })
  public start: Date;

  @Column({ type: 'timestamptz', nullable: false })
  public end: Date;

  @ManyToOne(() => UserEntity, (user) => user.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'bigint', nullable: false })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
