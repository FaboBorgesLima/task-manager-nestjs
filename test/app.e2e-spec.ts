import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import TypeormModule from '../src/database/typeorm.module';
import datasource from '../src/database/datasource';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeormModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
  afterEach(async () => {
    await datasource.initialize();
    for (const entity of datasource.entityMetadatas) {
      const repository = datasource.getRepository(entity.name);
      await repository.delete({});
    }
    await datasource.destroy();
    await app.close();
  });
});
