import { Test, TestingModule } from '@nestjs/testing';
import TypeormModule from '../src/database/typeorm.module';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDatabase } from './helpers/clearDatabase';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { faker } from '@faker-js/faker';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeormModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('user.name');
    expect(response.body).toHaveProperty('user.email');

    expect(response.body).toHaveProperty('token');
  });

  it('/users/:id (GET)', async () => {
    const name = faker.person.fullName();
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name,
        email: faker.internet.email(),
        password: 'password123',
      })
      .expect(201);

    const { user, token } = createResponse.body as {
      user: User;
      token: string;
    };
    const userId = user.id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).toHaveProperty('name', name);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('token');

    await request(app.getHttpServer())
      .get('/users/test')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/users/:id (PUT)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123',
      })
      .expect(201);
    const { user, token } = createResponse.body as {
      user: User;
      token: string;
    };

    const userId = user.id;
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: faker.person.fullName(),
      });
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('user.name');
    expect(response.body).toHaveProperty('user.id', userId);
    expect(response.body).toHaveProperty('token');
  });

  it('/users/:id (DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123',
      })
      .expect(201);
    const { user, token } = createResponse.body as {
      user: User;
      token: string;
    };
    const userId = user.id;
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterEach(async () => {
    await clearDatabase();
    await app.close();
  });
});
