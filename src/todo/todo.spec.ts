import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoService } from './todo.service';
import { TodoModule } from './todo.module';
import { CreateTodoDto } from './dto/create-todo.dto';
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
  });

  // PATCH /todo/:id
  describe('PATCH /todo/:id', () => {
    const mockTodoId = faker.string.uuid();
    const validBody: UpdateTodoDto = {
      done: faker.datatype.boolean(),
      label: faker.lorem.sentence(),
    };

    test('happy path', async () => {
      const mockUpdatedTodo = getRandomObject(); // structure doesn't matter
      mockTodoService.update.mockResolvedValue(mockUpdatedTodo);
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
  });
});
