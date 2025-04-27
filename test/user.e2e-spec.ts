import { Test, TestingModule } from '@nestjs/testing';
import TypeormModule from '../src/database/typeorm.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDatabase } from './clearDatabase';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeormModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('name', 'John Doe');
    expect(response.body.token).toBeDefined();
  });

  it('/users (GET)', async () => {
    let response = await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect({ users: [] });

    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      })
      .expect(201);

    response = await request(app.getHttpServer()).get('/users').expect(200);
    expect(response.body.users[0]).toHaveProperty('name', 'John Doe');
  });

  afterEach(async () => {
    await clearDatabase();
    await app.close();
  });
});
