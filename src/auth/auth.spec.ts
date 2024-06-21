import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import { UserService } from './user.service';
import getRandomObject from 'src/common/utils/getRandomObject';
import { LoginDto } from './dto/login.dto';
import { faker } from '@faker-js/faker';

//
// integration test
//
describe('Auth REST', () => {
  let app: INestApplication;
  const mockLoggedInDto = getRandomObject();
  const mockLoginFn = jest.fn().mockResolvedValue(mockLoggedInDto);
  const mockAuthService = {
    login: mockLoginFn,
  };

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
      const dto: LoginDto = {
        username: faker.person.firstName(),
        password: faker.string.sample(),
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto)
        .expect(200);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(response.body).toEqual(await mockAuthService.login());
    });
  });
});
