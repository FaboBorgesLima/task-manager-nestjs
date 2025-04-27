import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ type: 'char', length: 43, nullable: false })
  public password: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
