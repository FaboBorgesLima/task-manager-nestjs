import { TaskEntity } from '../../task/infra/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { unsigned: true, type: 'bigint' })
  public id?: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  public name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  public email: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => TaskEntity, (task) => task.user, {
    cascade: true,
  })
  public tasks?: TaskEntity[];

  @Column({ type: 'char', length: 60, nullable: false })
  public password: string;
}
