import { Test, TestingModule } from '@nestjs/testing';
import TypeormModule from '../src/database/typeorm.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDatabase } from './clearDatabase';
import { App } from 'supertest/types';
import { User } from 'src/user/domain/user';
import { faker } from '@faker-js/faker/.';

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

  it('/users (GET)', async () => {
    let response = await request(app.getHttpServer()).get('/users').expect(200);

    expect(response.body).toHaveProperty('users');

    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123',
      })
      .expect(201);

    response = await request(app.getHttpServer()).get('/users').expect(200);
    expect(response.body).toHaveProperty('users[0].name');

    const body = response.body as {
      users: ReturnType<User['toJSONProfile']>[];
    };
    expect(body.users.length).toBeGreaterThanOrEqual(1);
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

    const user = (
      createResponse.body as { user: ReturnType<User['toJSONProfile']> }
    ).user;
    const userId = user.id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);
    expect(response.body).toHaveProperty('name', name);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).not.toHaveProperty('email');
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
      user: ReturnType<User['toJSONProfile']>;
      token: string;
    };
    const userId = user.id;
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', token)
      .send({
        name: faker.person.fullName(),
      })
      .expect(200);

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
      user: ReturnType<User['toJSONProfile']>;
      token: string;
    };
    const userId = user.id;
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', token)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  afterEach(async () => {
    await clearDatabase();
    await app.close();
  });
});
