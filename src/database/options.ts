import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../user/infra/user.entity';
import { config } from 'dotenv';

export default (() => {
  config();
  if (process.env.NODE_ENV == 'test') {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT ?? ''),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [UserEntity],
      synchronize: false,
      migrations: ['src/migrations/*.ts'],
      migrationsRun: true,
    } as TypeOrmModuleOptions;
  }

  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? ''),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [UserEntity],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
  } as TypeOrmModuleOptions;
})();
