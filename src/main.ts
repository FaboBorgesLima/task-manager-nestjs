import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { bootstrap } from './bootstrap';

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  bootstrap(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  await app.getHttpAdapter().getInstance().ready();
}

main().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
