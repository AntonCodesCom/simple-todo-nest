import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoService } from './todo.service';
import { TodoModule } from './todo.module';
import { CreateTodoDto } from './dto/create-todo.dto';
import getRandomObjectArray from 'src/common/utils/getRandomObjectArray';
import { faker } from '@faker-js/faker';
import getRandomObject from 'src/common/utils/getRandomObject';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { aliceUserId } from 'src/auth/fixtures/users.fixture';
import { EnvService } from 'src/env/env.service';
import { EnvModule } from 'src/env/env.module';
import { sign } from 'jsonwebtoken';

//
// integration test
//
describe('Todo REST', () => {
  let app: INestApplication;
  const mockJwtSecret = faker.string.sample();
  const mockUserId = aliceUserId;
  const mockAccessToken = sign({ sub: mockUserId }, mockJwtSecret);
  const authorizationHeader = `Bearer ${mockAccessToken}`;
  const mockTodos = getRandomObjectArray(); // randomizing to prevent false positives
  const mockFindAllFn = jest.fn().mockResolvedValue(mockTodos);
  const mockCreatedTodo: object = getRandomObject(); // structure doesn't matter
  const mockCreateFn = jest.fn().mockResolvedValue(mockCreatedTodo);
  const mockUpdateFn = jest.fn();
  const mockRemoveFn = jest.fn();
  const mockTodoService = {
    findAll: mockFindAllFn,
    create: mockCreateFn,
    update: mockUpdateFn,
    remove: mockRemoveFn,
  };

  // init SUT app
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule, EnvModule],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .overrideProvider(EnvService)
      .useValue({ jwtSecret: mockJwtSecret })
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

  // DELETE /todo/:id
  describe('DELETE /todo/:id', () => {
    const mockTodoId = faker.string.uuid();

    test('happy path', async () => {
      mockTodoService.remove.mockResolvedValue(getRandomObject());
      const response = await request(app.getHttpServer())
        .delete(`/todo/${mockTodoId}`)
        .set('Authorization', authorizationHeader)
        .expect(200);
      expect(mockTodoService.remove).toHaveBeenCalledWith(
        mockUserId,
        mockTodoId,
      );
      expect(response.body).toEqual(await mockTodoService.remove());
    });

    test('Todo not found', async () => {
      mockTodoService.remove.mockResolvedValue(null);
      await request(app.getHttpServer())
        .delete(`/todo/${mockTodoId}`)
        .set('Authorization', authorizationHeader)
        .expect(404);
    });

    test('invalid authorization', async () => {
      await request(app.getHttpServer())
        .delete(`/todo/${mockTodoId}`)
        .expect(401);
    });

    test('invalid `id` parameter (non-UUID)', async () => {
      const invalidTodoId = 'non-uuid';
      await request(app.getHttpServer())
        .delete(`/todo/${invalidTodoId}`)
        .set('Authorization', authorizationHeader)
        .expect(400);
    });
  });
});
