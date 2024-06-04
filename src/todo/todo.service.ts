import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import todosFixture from './fixtures/todos';
import { EnvService } from 'src/env/env.service';
import { TodoEntity } from './entities/todo.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
        userId,
        label: createTodoDto.label,
      },
    });
  }

  async findAll(userId: string): Promise<TodoEntity[]> {
    return await this.prismaService.todo.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   *
   * @returns `TodoEntity` when the todo is updated successfully
   * @returns `null` if a todo with given `id` and `userId` not found
   */
  async update(
    userId: string,
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity | null> {
    // TODO: figure out why TypeScript always marks return type as `Promise<TodoEntity>`
    try {
      const { label, done } = updateTodoDto;
      return await this.prismaService.todo.update({
        where: { id, userId },
        data: { label, done },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        return null;
      }
      throw err;
    }
  }

  /**
   *
   * @returns `TodoEntity` when the todo is deleted successfully
   * @returns `null` if a todo with given `id` and `userId` not found
   */
  async remove(userId: string, id: string) /*: Promise<TodoEntity | null>*/ {
    // try {
    //   return await this.prismaService.todo.delete({
    //     where: { id, userId },
    //   });
    // } catch (err) {
    //   if (
    //     err instanceof PrismaClientKnownRequestError &&
    //     err.code === 'P2025'
    //   ) {
    //     return null;
    //   }
    //   throw err;
    // }
    try {
      return await this.prismaService.todo.delete({
        where: { id, userId },
      });
    } catch (err) {
      return null;
    }
  }

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
      data: todosFixture,
    });
  }
}
