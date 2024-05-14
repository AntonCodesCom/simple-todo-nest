import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule } from './env/env.module';
import { PrismaModule } from './prisma/prisma.module';
import { TodoModule } from './todo/todo.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [EnvModule, PrismaModule, TodoModule, SeedModule],
  controllers: [AppController],
})
export class AppModule {}
