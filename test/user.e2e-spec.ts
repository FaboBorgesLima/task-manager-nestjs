import { Test, TestingModule } from '@nestjs/testing';
import TypeormModule from '../src/database/typeorm.module';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { clearDatabase } from './helpers/clearDatabase';
import { faker } from '@faker-js/faker';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { EmailServiceInterface } from '../src/email/domain/email.service.interface';
import { EmailMockService } from '../src/email/app/email-mock.service';
import { UserResponseDto } from '../src/user/app/dtos/user-response-dto';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;
  let registerResponse: { user: UserResponseDto; token: string };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeormModule],
    })
      .overrideProvider(EmailServiceInterface)
      .useClass(EmailMockService)
      .compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    const email = faker.internet.email();
    const name = faker.person.fullName();
    const password = faker.internet.password();

    await request(app.getHttpServer())
      .post('/auth/send-validation')
      .send({ email })
      .expect(HttpStatus.CREATED);

    const validationCode = EmailMockService.emails
      .get(email)
      ?.text.split(' ')
      .pop();

    expect(validationCode).toBeDefined();

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name,
        email,
        password,
        validation: validationCode,
      })
      .expect(HttpStatus.CREATED);

    registerResponse = response.body as {
      user: UserResponseDto;
      token: string;
    };
  });

  it('/users/:id (GET)', async () => {
    const { user, token } = registerResponse;
    const userId = user.id;

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).toHaveProperty('name', user.name);
    expect(response.body).toHaveProperty('id', userId);
    expect(response.body).toHaveProperty('email');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('token');

    await request(app.getHttpServer())
      .get('/users/test')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/users/:id (DELETE)', async () => {
    const { user, token } = registerResponse;

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
