// test-utils/typeorm-test.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/infra/user.entity';

export default TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? ''),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [UserEntity],
  synchronize: true,
});
