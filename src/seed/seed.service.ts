import { Injectable } from '@nestjs/common';
import { UserService } from 'src/auth/user.service';
import { EnvService } from 'src/env/env.service';
import { TodoService } from 'src/todo/todo.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly envService: EnvService,
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  async clear(): Promise<void> {
    if (this.envService.isProd) {
      throw new Error('Data seeding is not allowed in production mode.');
    }
    await this.todoService.clear();
    await this.userService.clear();
  }

  async seed(): Promise<void> {
    if (this.envService.isProd) {
      throw new Error('Data seeding is not allowed in production mode.');
    }
    await this.clear();
    await this.userService.seed();
    await this.todoService.seed();
  }
}
