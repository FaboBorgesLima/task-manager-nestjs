import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import typeormModule from '../src/database/typeorm.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, typeormModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', async () => {
    const email = faker.internet.email();
    // First, create a user to test the login
    await request(app.getHttpServer()).post('/users').send({
      name: faker.person.fullName(),
      email,
      password: 'password123',
    });

    // Now, test the login endpoint
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');

    // Wrong password test
    const wrongPasswordResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'wrongpassword',
      });

    expect(wrongPasswordResponse.status).toBe(401);
  });

  it('/auth/me (GET)', async () => {
    const email = faker.internet.email();
    // First, create a user to test the login
    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: faker.person.fullName(),
        email,
        password: 'password123',
      });
    const body = createResponse.body as {
      token: string;
    };

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `${body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', email);
  });
});
