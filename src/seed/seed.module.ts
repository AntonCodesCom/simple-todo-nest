import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TodoModule } from 'src/todo/todo.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TodoModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
