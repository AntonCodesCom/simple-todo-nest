import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import { UserService } from './user.service';

//
// integration test
//
describe('Auth REST', () => {
  let app: INestApplication;
  const mockAuthService = {};

  // init SUT app
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(UserService)
      .useValue({})
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // login
  describe('POST /auth/login', () => {
    test('happy path', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .expect(200);
    });
  });
});
