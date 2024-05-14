import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports: [TodoModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
