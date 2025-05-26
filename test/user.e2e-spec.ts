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
import { EmailValidationServiceInterface } from '@faboborgeslima/task-manager-domain/auth';
import { MockEmailValidationService } from '../src/auth/infra/services/mock-email-validation.service';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeormModule],
    })
      .overrideProvider(EmailValidationServiceInterface)
      .useClass(MockEmailValidationService)
      .compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/users/:id (GET)', async () => {
    const name = faker.person.fullName();
    const createResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name,
        email: faker.internet.email(),
        password: 'password123',
        validation: MockEmailValidationService.VALIDATION_CODE,
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

  it('/users/:id (DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123',
        validation: MockEmailValidationService.VALIDATION_CODE,
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
