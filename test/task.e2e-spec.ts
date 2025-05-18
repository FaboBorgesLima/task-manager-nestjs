import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AbstractAuthService } from '../src/auth/domain/abstract-auth.service';
import typeormModule from '../src/database/typeorm.module';
import { User } from '../src/user/domain/user';
import { UserRepositoryInterface } from '../src/user/domain/user.repository.interface';
import * as request from 'supertest';
import { clearDatabase } from './helpers/clearDatabase';
import { TaskResponseDto } from '../src/task/app/dto/task-response-dto';
import { HashServiceInterface } from '../src/hash/domain/hash.service.interface';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpStatus } from '@nestjs/common';
import { bootstrap } from '../src/bootstrap';

describe('TaskController (e2e)', () => {
  let app: NestFastifyApplication;
  let token: string;
  let user: User;
  let userService: UserRepositoryInterface;
  let authService: AbstractAuthService;
  let hashService: HashServiceInterface;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, typeormModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    bootstrap(app);

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    userService = moduleFixture.get<UserRepositoryInterface>(
      UserRepositoryInterface,
    );
    authService = moduleFixture.get<AbstractAuthService>(AbstractAuthService);
    hashService = moduleFixture.get<HashServiceInterface>(HashServiceInterface);
    user = User.create(
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
      hashService,
    );

    user = await userService.saveOne(user);
    token = await authService.toToken(user);
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
