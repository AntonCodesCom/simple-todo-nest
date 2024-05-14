import { Injectable } from '@nestjs/common';
import { TodoService } from 'src/todo/todo.service';

@Injectable()
export class SeedService {
  constructor(private readonly todoService: TodoService) {}

  async clear(): Promise<void> {
    // TODO: non-prod only
    await this.todoService.clear();
  }

  async seed(): Promise<void> {
    // TODO: non-prod only
    await this.clear();
    await this.todoService.seed();
  }
}
