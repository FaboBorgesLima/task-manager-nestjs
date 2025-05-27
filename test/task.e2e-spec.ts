import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/app/services/auth.service';
import typeormModule from '../src/database/typeorm.module';
import { User } from '@faboborgeslima/task-manager-domain/user';
import request from 'supertest';
import { clearDatabase } from './helpers/clearDatabase';
import { TaskResponseDto } from '../src/task/app/dto/task-response-dto';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpStatus } from '@nestjs/common';
import { bootstrap } from '../src/bootstrap';
import { EmailServiceInterface } from '../src/email/domain/email.service.interface';
import { EmailMockService } from '../src/email/app/email-mock.service';

describe('TaskController (e2e)', () => {
  let app: NestFastifyApplication;
  let token: string;
  let user: User;
  let authService: AuthService;

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

    bootstrap(app);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    authService = moduleFixture.get<AuthService>(AuthService);

    user = new User({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await authService.sendValidation(user.email);
    const validationCode = EmailMockService.emails
      .get(user.email)
      ?.text.split(' ')
      .pop();

    const register = await authService.register(
      user,
      {
        email: user.email,
        password: faker.internet.password(),
      },
      validationCode as string,
    );
    token = register.token;
  });

  it('/tasks (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        start: new Date(),
        end: new Date(),
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('title', 'Test Task');
    expect(response.body).toHaveProperty('description', 'This is a test task');
  });

  it('/tasks (GET)', async () => {
    await request(app.getHttpServer())
      .get('/tasks')
      .expect(HttpStatus.UNAUTHORIZED);

    const response = await request(app.getHttpServer())
      .get('/tasks?startDate=2023-01-01&endDate=2023-12-31')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/tasks/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        start: new Date(),
        end: new Date(),
      })
      .expect(201);

    const createResponseBody = createResponse.body as TaskResponseDto;
    const taskId = createResponseBody.id;

    const response = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id', taskId);
  });

  it('/tasks/:id (PUT)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        start: new Date(),
        end: new Date(),
      })
      .expect(201);
    const createResponseBody = createResponse.body as TaskResponseDto;
    const taskId = createResponseBody.id;
    const response = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'completed',
        title: 'Updated Task',
        description: 'This is an updated test task',
        start: new Date(),
        end: new Date(),
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('id', taskId);
    expect(response.body).toHaveProperty('status', 'completed');
    expect(response.body).toHaveProperty('title', 'Updated Task');
    expect(response.body).toHaveProperty(
      'description',
      'This is an updated test task',
    );
  });

  it('/tasks/:id (DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        start: new Date(),
        end: new Date(),
      })
      .expect(201);
    const createResponseBody = createResponse.body as TaskResponseDto;
    const taskId = createResponseBody.id;

    const response = await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await clearDatabase();
  });
});
