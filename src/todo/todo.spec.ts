import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TodoService } from './todo.service';
import { TodoModule } from './todo.module';
import { CreateTodoDto } from './dto/create-todo.dto';
import { validate } from 'class-validator';
import validatorOptions from 'src/common/validator-options';
import { aliceUserId } from './fixtures/user-ids';
import getRandomObjectArray from 'src/common/utils/getRandomObjectArray';
import { faker } from '@faker-js/faker';
import getRandomObject from 'src/common/utils/getRandomObject';

//
// integration test
//
describe('Todo REST', () => {
  let app: INestApplication;
  const mockUserId = aliceUserId;
  const authorizationHeader = `Bearer ${mockUserId}`;
  const mockTodos = getRandomObjectArray(); // randomizing to prevent false positives
  const mockFindAllFn = jest.fn().mockResolvedValue(mockTodos);
  const mockCreatedTodo: object = getRandomObject(); // structure doesn't matter
  const mockCreateFn = jest.fn().mockResolvedValue(mockCreatedTodo);
  const mockTodoService = {
    findAll: mockFindAllFn,
    create: mockCreateFn,
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
    app.useGlobalPipes(new ValidationPipe(validatorOptions));
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
      expect(response.body).toEqual(await mockTodoService.findAll());
    });

    test('invalid authorization', async () => {
      await request(app.getHttpServer()).get('/todo').expect(401);
    });
  });

  // POST /todo
  describe('POST /todo', () => {
    const validBody: CreateTodoDto = {
      label: 'Valid label.',
    };

    test('valid request data', async () => {
      const response = await request(app.getHttpServer())
        .post('/todo')
        .set('Authorization', authorizationHeader)
        .send(validBody)
        .expect(201);
      expect(mockTodoService.create).toHaveBeenCalledWith(
        validBody,
        mockUserId,
      );
      expect(response.body).toEqual(await mockTodoService.create());
    });

    test('invalid authorization', async () => {
      await request(app.getHttpServer()).post('/todo').expect(401);
    });

    test('invalid request body', async () => {
      // Defining body that will always be invalid against the target `CreateTodoDto`
      // (just don't define `CreateTodoDto.invalidProperty` within the DTO itself).
      // This approach will, however, work only when unknown body properties are
      // supposed to be rejected by endpoints.
      const invalidBody = new CreateTodoDto();
      (invalidBody as any).invalidProperty = true;
      const validationErrors = await validate(invalidBody, validatorOptions);
      expect(validationErrors.length).toBeGreaterThan(0);
      await request(app.getHttpServer())
        .post('/todo')
        .set('Authorization', authorizationHeader)
        .send(invalidBody)
        .expect(400);
    });
  });
});
