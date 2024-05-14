import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import todos from './fixtures/todos';

@Injectable()
export class TodoService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createTodoDto: CreateTodoDto) {
    return 'This action adds a new todo';
  }

  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }

  async seed(): Promise<void> {
    // TODO: non-prod only
    await this.prismaService.todo.createMany({
      data: todos,
    });
  }

  async clear(): Promise<void> {
    // TODO: non-prod only
    await this.prismaService.todo.deleteMany({});
  }
}
