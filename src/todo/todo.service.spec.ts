import getRandomObjectArray from 'src/common/utils/getRandomObjectArray';
import { TodoService } from './todo.service';
import { faker } from '@faker-js/faker';
import { CreateTodoDto } from './dto/create-todo.dto';
import getRandomObject from 'src/common/utils/getRandomObject';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { initTodo } from './entities/todo.entity';

//
// unit test
//
describe('TodoService', () => {
  const mockTodos = getRandomObjectArray();
  const mockFindManyFn = jest.fn().mockResolvedValue(mockTodos);
  const mockCreatedTodo: object = getRandomObject(); // structure doesn't matter
  const mockCreateFn = jest.fn().mockResolvedValue(mockCreatedTodo);
  const mockPrismaService = {
    todo: {
      findMany: mockFindManyFn,
      create: mockCreateFn,
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const todoService = new TodoService(
    {} as any, // EnvService
    mockPrismaService as any, // PrismaService
  );

  // findAll()
  test('findAll()', async () => {
    const mockUserId = faker.string.sample();
    const actual = await todoService.findAll(mockUserId);
    expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
      where: {
        userId: mockUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const expected = await mockPrismaService.todo.findMany();
    expect(actual).toEqual(expected);
  });

  // create()
  test('create()', async () => {
    const mockUserId = faker.string.sample();
    // defining the entire entity as create DTO to test that
    // only allowed properties are passed to the database
    const potentiallyUnsafeDto = initTodo({
      userId: '!!!__UNSAFE_USER_ID__!!!',
      label: `   label with white space: ${faker.string.sample()}  `,
    }) as CreateTodoDto;
    const actual = await todoService.create(potentiallyUnsafeDto, mockUserId);
    expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
      data: {
        userId: mockUserId,
        label: potentiallyUnsafeDto.label.trim(),
      },
    });
    expect(actual).toEqual(await mockPrismaService.todo.create());
  });

  // update()
  describe('update()', () => {
    const mockUserId = faker.string.sample();
    const mockTodoId = faker.string.sample(); // format doesn't matter
    // defining the entire entity as update DTO to test that
    // only allowed properties are passed to the database
    const potentiallyUnsafeDto = initTodo({
      userId: '!!!__UNSAFE_USER_ID__!!!',
      label: `   label with white space: ${faker.string.sample()}  `,
    }) as UpdateTodoDto;

    test('happy path', async () => {
      const mockUpdatedTodo = getRandomObject();
      mockPrismaService.todo.update.mockResolvedValue(mockUpdatedTodo);
      const actual = await todoService.update(
        mockUserId,
        mockTodoId,
        potentiallyUnsafeDto,
      );
      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: {
          id: mockTodoId,
          userId: mockUserId,
        },
        data: {
          label: potentiallyUnsafeDto.label.trim(),
          done: potentiallyUnsafeDto.done,
        },
      });
      expect(actual).toEqual(await mockPrismaService.todo.update());
    });

    test('Todo not found', async () => {
      const mockError = new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '',
      });
      mockPrismaService.todo.update.mockRejectedValue(mockError);
      const actual = await todoService.update(
        mockUserId,
        mockTodoId,
        potentiallyUnsafeDto,
      );
      expect(actual).toBeNull();
    });

    test('unknown prisma error', async () => {
      class TestError extends Error {
        constructor(
          public message: string,
          public code: string,
        ) {
          super(message);
        }
      }
      const code = 'P2025'; // same code as for "Todo not found" to prevent false positives
      const mockError = new TestError('', code);
      mockPrismaService.todo.update.mockRejectedValue(mockError);
      await expect(
        todoService.update(mockUserId, mockTodoId, potentiallyUnsafeDto),
      ).rejects.toBe(mockError);
    });
  });

  // remove()
  describe('remove()', () => {
    const mockUserId = faker.string.sample();
    const mockTodoId = faker.string.sample();

    test('happy path', async () => {
      mockPrismaService.todo.delete.mockResolvedValue(getRandomObject());
      const actual = await todoService.remove(mockUserId, mockTodoId);
      expect(mockPrismaService.todo.delete).toHaveBeenCalledWith({
        where: {
          id: mockTodoId,
          userId: mockUserId,
        },
      });
      expect(actual).toEqual(await mockPrismaService.todo.delete());
    });

    test('Todo not found', async () => {
      const mockError = new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '',
      });
      mockPrismaService.todo.delete.mockRejectedValue(mockError);
      const actual = await todoService.remove(mockUserId, mockTodoId);
      expect(actual).toBeNull();
    });

    test('unknown prisma error', async () => {
      class TestError extends Error {
        constructor(
          public message: string,
          public code: string,
        ) {
          super(message);
        }
      }
      const code = 'P2025'; // same code as for "Todo not found" to prevent false positives
      const mockError = new TestError('', code);
      mockPrismaService.todo.delete.mockRejectedValue(mockError);
      await expect(todoService.remove(mockUserId, mockTodoId)).rejects.toBe(
        mockError,
      );
    });
  });
});
