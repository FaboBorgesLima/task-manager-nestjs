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
import { EmailValidationServiceInterface } from '@faboborgeslima/task-manager-domain/auth';
import { MockEmailValidationService } from '../src/auth/infra/services/mock-email-validation.service';

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    // Clear the database before all tests
    await clearDatabase();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, typeormModule],
    })
      .overrideProvider(EmailValidationServiceInterface)
      .useClass(MockEmailValidationService)
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/auth/register (POST)', async () => {
    const email = faker.internet.email();
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: faker.person.fullName(),
        email,
        password: 'password123',
        validation: MockEmailValidationService.VALIDATION_CODE,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('/auth/login (POST)', async () => {
    const email = faker.internet.email();
    // First, create a user to test the login
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: faker.person.fullName(),
        email,
        password: 'password123',
        validation: MockEmailValidationService.VALIDATION_CODE,
      })
      .expect(201);

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
      .post('/auth/register')
      .send({
        name: faker.person.fullName(),
        email,
        password: 'password123',
        validation: MockEmailValidationService.VALIDATION_CODE,
      });
    const body = createResponse.body as {
      token: string;
    };

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${body.token}`);

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
