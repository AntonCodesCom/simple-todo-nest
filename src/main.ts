import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  // init
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // cors

  // env
  const { port } = app.get(EnvService);

  // launch
  await app.listen(port);
}
bootstrap();
