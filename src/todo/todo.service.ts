import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import todos from './fixtures/todos';
import { EnvService } from 'src/env/env.service';
import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    private readonly envService: EnvService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    createTodoDto: CreateTodoDto,
    userId: string,
  ): Promise<TodoEntity> {
    return await this.prismaService.todo.create({
      data: {
        ...createTodoDto,
        userId,
      },
    });
  }

  async findAllByUserId(userId: string): Promise<TodoEntity[]> {
    return await this.prismaService.todo.findMany({
      where: { userId },
    });
  }

  async update(
    userId: string,
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    // TODO: forbidden check
    return await this.prismaService.todo.update({
      where: { id, userId },
      data: updateTodoDto,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} todo`;
  // }

  async clear(): Promise<void> {
    if (this.envService.isProd) {
      throw new Error('Data seeding is not allowed in production mode.');
    }
    await this.prismaService.todo.deleteMany({});
  }

  async seed(): Promise<void> {
    if (this.envService.isProd) {
      throw new Error('Data seeding is not allowed in production mode.');
    }
    await this.prismaService.todo.createMany({
      data: todos,
    });
  }
}
