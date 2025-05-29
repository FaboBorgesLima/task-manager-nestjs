import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('validation_codes')
export class ValidationCodeEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'email',
    unique: true,
    nullable: false,
    comment: 'Email address to validate',
  })
  email: string;

  @Column({
    type: 'char',
    length: 6,
    name: 'validation_code',
    nullable: false,
  })
  validationCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
