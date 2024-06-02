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
import { UpdateTodoDto } from './dto/update-todo.dto';

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
  const mockUpdateFn = jest.fn();
  const mockTodoService = {
    findAll: mockFindAllFn,
    create: mockCreateFn,
    update: mockUpdateFn,
  };

  // init SUT app
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .compile(); // TODO: override interceptor (AuthInterceptor)
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
    test('valid request data', async () => {
      const validBody: CreateTodoDto = {
        label: 'Valid label.', // can be randomized
      };
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

  // PATCH /todo/:id
  describe('PATCH /todo/:id', () => {
    const mockTodoId = faker.string.uuid();
    const validBody: UpdateTodoDto = {
      done: faker.datatype.boolean(),
      label: faker.lorem.sentence(),
    };

    test('happy path', async () => {
      const mockUpdatedDto = getRandomObject(); // structure doesn't matter
      mockTodoService.update.mockResolvedValue(mockUpdatedDto);
      const response = await request(app.getHttpServer())
        .patch(`/todo/${mockTodoId}`)
        .set('Authorization', authorizationHeader)
        .send(validBody)
        .expect(200);
      expect(mockTodoService.update).toHaveBeenCalledWith(
        mockUserId,
        mockTodoId,
        validBody,
      );
      expect(response.body).toEqual(await mockTodoService.update());
    });

    test('Todo not found', async () => {
      mockTodoService.update.mockResolvedValue(null);
      await request(app.getHttpServer())
        .patch(`/todo/${mockTodoId}`)
        .set('Authorization', authorizationHeader)
        .send(validBody)
        .expect(404);
      // TODO: figure out whether it is necessary to assert service method args
    });

    test('invalid authorization', async () => {
      await request(app.getHttpServer())
        .patch(`/todo/${mockTodoId}`)
        .expect(401);
    });

    test('invalid `id` parameter (non-UUID)', async () => {
      const invalidTodoId = 'non-uuid';
      await request(app.getHttpServer())
        .patch(`/todo/${invalidTodoId}`)
        .set('Authorization', authorizationHeader)
        .send(validBody)
        .expect(400);
    });

    test('invalid request body', async () => {
      const invalidBody = new UpdateTodoDto();
      (invalidBody as any).invalidProperty = true;
      const validationErrors = await validate(invalidBody, validatorOptions);
      expect(validationErrors.length).toBeGreaterThan(0);
      await request(app.getHttpServer())
        .patch(`/todo/${mockTodoId}`)
        .set('Authorization', authorizationHeader)
        .send(invalidBody)
        .expect(400);
    });
  });
});
