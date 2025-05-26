import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import entities from './entities';

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
      entities,
      synchronize: true,
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
    entities,
    synchronize: true,
    migrations: ['dist/migrations/*.js'],
    migrationsRun: true,
  } as TypeOrmModuleOptions;
})();
