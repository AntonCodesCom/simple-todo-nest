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

// test data
const mockTodos = todosFixture;
const mockFindAllByUserIdFn = jest.fn().mockReturnValue(mockTodos); // TODO: random return value
const mockTodoService = {
  findAllByUserId: mockFindAllByUserIdFn,
};

//
// integration test
//
describe('Todo REST', () => {
  let app: INestApplication;
  const authorizationHeader = `Bearer ${aliceUserId}`;

  // before each
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

      it.todo(
        'should return `TodoService.findAll()` return value as response body',
      );
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
    expect(response.body).toEqual(mockTodoService.findAllByUserId());
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
