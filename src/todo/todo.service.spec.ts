import getRandomObjectArray from 'src/common/utils/getRandomObjectArray';
import { TodoService } from './todo.service';
import { faker } from '@faker-js/faker';
import { CreateTodoDto } from './dto/create-todo.dto';
import getRandomObject from 'src/common/utils/getRandomObject';

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
    const validDto: CreateTodoDto = {
      label: faker.lorem.sentence(),
    };
    const actual = await todoService.create(validDto, mockUserId);
    // TODO: assert prisma method args
    expect(actual).toEqual(await mockPrismaService.todo.create());
  });
});
