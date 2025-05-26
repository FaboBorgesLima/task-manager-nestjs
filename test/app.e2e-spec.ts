import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import TypeormModule from '../src/database/typeorm.module';
import { clearDatabase } from './helpers/clearDatabase';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { MockEmailValidationService } from '../src/auth/infra/services/mock-email-validation.service';
import { EmailValidationServiceInterface } from '@faboborgeslima/task-manager-domain/auth';

describe('AppController (e2e)', () => {
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

  it('/test (GET)', () => {
    return request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect('Hello World!');
  });

  afterAll(async () => {
    await app.close();
  });
  afterEach(async () => {
    await clearDatabase();
    await app.close();
  });
});
