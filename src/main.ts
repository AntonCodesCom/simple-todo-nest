import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // init
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // cors

  // env
  const { isProd, port } = app.get(EnvService);

  // swagger (non-prod only)
  if (!isProd) {
    const config = new DocumentBuilder()
      .setTitle('Todo app API')
      .setDescription('REST API for the todo app backend (built on NestJS).')
      .setVersion('0.0.1')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      })
      .addTag('seed')
      .addTag('todo')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // launch
  await app.listen(port);
}
bootstrap();
