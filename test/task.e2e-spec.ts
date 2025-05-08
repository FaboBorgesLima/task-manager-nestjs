import { faker } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AbstractAuthService } from '../src/auth/domain/abstract-auth.service';
import typeormModule from '../src/database/typeorm.module';
import { User } from '../src/user/domain/user';
import { UserServiceInterface } from '../src/user/domain/user.service.interface';
import * as request from 'supertest';
import { clearDatabase } from './helpers/clearDatabase';
import { TaskResponseDto } from '../src/task/app/dto/task-response-dto';
import { App } from 'supertest/types';
import { HashServiceInterface } from '../src/hash/domain/hash.service.interface';

describe('TaskController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let user: User;
  let userService: UserServiceInterface;
  let authService: AbstractAuthService;
  let hashService: HashServiceInterface;

  beforeAll(async () => {
    // Clear the database before all tests
    await clearDatabase();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, typeormModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<UserServiceInterface>(UserServiceInterface);
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
        dueDate: new Date(),
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body).toHaveProperty('title', 'Test Task');
    expect(response.body).toHaveProperty('description', 'This is a test task');
  });

  it('/tasks (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/tasks')
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
        dueDate: new Date(),
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
        dueDate: new Date(),
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
        dueDate: new Date(),
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
        dueDate: new Date(),
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
