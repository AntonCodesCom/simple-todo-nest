import getRandomObjectArray from 'src/common/utils/getRandomObjectArray';
import { TodoService } from './todo.service';
import { faker } from '@faker-js/faker';
import { CreateTodoDto } from './dto/create-todo.dto';
import getRandomObject from 'src/common/utils/getRandomObject';
import { UpdateTodoDto } from './dto/update-todo.dto';

//
// unit test
//
describe('TodoService', () => {
  const mockTodos = getRandomObjectArray();
  const mockFindManyFn = jest.fn().mockResolvedValue(mockTodos);
  const mockCreatedTodo: object = getRandomObject(); // structure doesn't matter
  const mockCreateFn = jest.fn().mockResolvedValue(mockCreatedTodo);
  const mockUpdateFn = jest.fn();
  const mockPrismaService = {
    todo: {
      findMany: mockFindManyFn,
      create: mockCreateFn,
      update: mockUpdateFn,
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
    expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
      data: {
        ...validDto,
        userId: mockUserId,
      },
    });
    expect(actual).toEqual(await mockPrismaService.todo.create());
  });

  // update()
  describe('update()', () => {
    test('happy path', async () => {
      const mockUserId = faker.string.sample();
      const mockTodoId = faker.string.sample(); // format doesn't matter
      const validDto: UpdateTodoDto = {
        done: faker.datatype.boolean(),
        label: faker.lorem.sentence(),
      };
      const mockUpdatedTodo = getRandomObject();
      mockPrismaService.todo.update.mockResolvedValue(mockUpdatedTodo);
      const actual = await todoService.update(mockUserId, mockTodoId, validDto);
      expect(actual).toEqual(await mockPrismaService.todo.update());
    });

    test.todo('Todo not found');

    test.todo('unknown error');
  });
});
