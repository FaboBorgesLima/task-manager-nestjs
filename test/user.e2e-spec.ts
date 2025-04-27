import { Test, TestingModule } from '@nestjs/testing';
import TypeormModule from '../src/database/typeorm.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDatabase } from './clearDatabase';
import { App } from 'supertest/types';
import { User } from 'src/user/domain/user';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;

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
    expect(response.body).toHaveProperty('user.name', 'John Doe');

    expect(response.body).toHaveProperty('token');
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
    expect(response.body).toHaveProperty('users[0].name', 'John Doe');
  });

  it('/users/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'joe.doe@example.com',
        password: 'password123',
      })
      .expect(201);

    const user = (
      createResponse.body as { user: ReturnType<User['toJSONProfile']> }
    ).user;
    const userId = user.id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);
    expect(response.body).toHaveProperty('name', 'John Doe');
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).not.toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('token');

    await request(app.getHttpServer()).get('/users/test').expect(500);
  });

  afterEach(async () => {
    await clearDatabase();
    await app.close();
  });
});
