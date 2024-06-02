import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoService } from './todo.service';
import { TodoModule } from './todo.module';
import { CreateTodoDto } from './dto/create-todo.dto';
import { validate } from 'class-validator';
import validatorOptions from 'src/common/validator-options';
import { aliceUserId } from './fixtures/user-ids';
import getRandomObjectArray from 'src/common/utils/getRandomObjectArray';

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
    test('valid request data', async () => {
      const response = await request(app.getHttpServer())
        .get('/todo')
        .set('Authorization', authorizationHeader)
        .expect(200);
      expect(mockTodoService.findAll).toHaveBeenCalledWith(mockUserId);
      expect(response.body).toEqual(mockTodoService.findAll());
    });

    test('invalid authorization', async () => {
      await request(app.getHttpServer()).get('/todo').expect(401);
    });
  });

  describe.skip('POST /todo', () => {
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
