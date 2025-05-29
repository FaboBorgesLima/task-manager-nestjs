import { AppModule } from '../src/app.module';
import typeormModule from '../src/database/typeorm.module';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { clearDatabase } from './helpers/clearDatabase';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { EmailServiceInterface } from '../src/email/domain/email.service.interface';
import { EmailMockService } from '../src/email/app/email-mock.service';
import { UserResponseDto } from '../src/user/app/dtos/user-response-dto';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Clear the database before all tests
    await clearDatabase();
  });

  async function registerUser(props: {
    email: string;
    name: string;
    password: string;
  }): Promise<{
    token: string;
    user: UserResponseDto;
  }> {
    await request(app.getHttpServer()).post('/auth/send-validation').send({
      email: props.email,
    });
    const validationCode = EmailMockService.emails
      .get(props.email)
      ?.text.split(' ')
      .pop();
    expect(validationCode).toBeDefined();

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: props.name,
        email: props.email,
        password: props.password,
        validation: validationCode,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    const body = response.body as { token: string; user: UserResponseDto };

    return body;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, typeormModule],
    })
      .overrideProvider(EmailServiceInterface)
      .useClass(EmailMockService)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/auth/register (POST)', async () => {
    const email = faker.internet.email();
    await request(app.getHttpServer()).post('/auth/send-validation').send({
      email,
    });
    const validationCode = EmailMockService.emails
      .get(email)
      ?.text.split(' ')
      .pop();
    expect(validationCode).toBeDefined();

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: faker.person.fullName(),
        email,
        password: 'password123',
        validation: validationCode,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('/auth/login (POST)', async () => {
    const email = faker.internet.email();
    // First, create a user to test the login
    await registerUser({
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
    const createResponse = await registerUser({
      name: faker.person.fullName(),
      email,
      password: 'password123',
    });

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${createResponse.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user.email', email);
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await clearDatabase();
  });
});
