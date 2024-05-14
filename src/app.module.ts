import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EnvModule } from './env/env.module';

@Module({
  imports: [EnvModule],
  controllers: [AppController],
})
export class AppModule {}
