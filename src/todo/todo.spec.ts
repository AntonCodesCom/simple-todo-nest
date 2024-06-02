import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import todosFixture from './fixtures/todos';
import { TodoService } from './todo.service';
import { TodoModule } from './todo.module';
import { CreateTodoDto } from './dto/create-todo.dto';
import { validate } from 'class-validator';
import validatorOptions from 'src/common/validator-options';
import { aliceUserId } from './fixtures/user-ids';
import { faker } from '@faker-js/faker';

// test data
const mockTodos = todosFixture;
const mockFindAllByUserIdFn = jest.fn().mockReturnValue(mockTodos); // TODO: random return value

// utility
// TODO: replace deprecated `faker.datatype.json()`
function getRandomObjectArray(): object[] {
  return faker.helpers.multiple(
    () => JSON.parse(faker.datatype.json()) as object,
    { count: { min: 1, max: 10 } },
  );
}

//
// integration test
//
describe('Todo REST', () => {
  let app: INestApplication;
  const mockUserId = aliceUserId;
  const authorizationHeader = `Bearer ${mockUserId}`;
  const mockTodos = getRandomObjectArray(); // randomizing to prevent false positives
  const mockFindAllFn = jest.fn().mockReturnValue(mockTodos);
  const mockTodoService = {
    findAll: mockFindAllFn,
  };

  // init SUT app
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // GET /todo
  describe('GET /todo', () => {
    describe('on valid data', () => {
      it('should respond with 200', async () => {
        await request(app.getHttpServer())
          .get('/todo')
          .set('Authorization', authorizationHeader)
          .expect(200);
      });

      it('should return `TodoService.findAll()` value as body', async () => {
        const response = await request(app.getHttpServer())
          .get('/todo')
          .set('Authorization', authorizationHeader);
        expect(response.body).toEqual(mockTodoService.findAll());
      });

      it.todo('should call `TodoService.findAll()` with given user ID');
    });

    describe('on invalid authorization', () => {
      it.todo('should respond with 401');
    });
  });

  test.skip('GET /todo', async () => {
    const response = await request(app.getHttpServer())
      .get('/todo')
      .expect(200);
    expect(mockFindAllByUserIdFn).toHaveBeenCalled();
    expect(response.body).toEqual(mockTodoService.findAll());
  });

  describe('POST /todo', () => {
    it('should return 400 on invalid request body', async () => {
      // Defining body that will always be invalid against the target `CreateTodoDto`
      // (just don't define `CreateTodoDto.invalidProperty` within the DTO itself).
      // This approach will, however, work only when unknown body properties are
      // supposed to be rejected by endpoints.
      const createTodoDto = new CreateTodoDto();
      (createTodoDto as any).invalidProperty = true;
      const validationErrors = await validate(createTodoDto, validatorOptions);
      expect(validationErrors.length).toBeGreaterThan(0);
      // TODO: test request
    });
  });
});
