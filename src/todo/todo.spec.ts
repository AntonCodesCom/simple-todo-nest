import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import todosFixture from './fixtures/todos';
import { TodoService } from './todo.service';
import { TodoModule } from './todo.module';
import { CreateTodoDto } from './dto/create-todo.dto';
import { validate } from 'class-validator';
import validatorOptions from 'src/common/validator-options';

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
