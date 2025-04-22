import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('increment', { unsigned: true, type: 'bigint' })
  public id?: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public email: string;

  @Column({ type: 'char', length: 43, nullable: false })
  public password: string;

  @Column({ type: 'uuid', nullable: false })
  public token: string;
}
