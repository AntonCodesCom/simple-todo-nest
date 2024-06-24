import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import { UserService } from './user.service';
import getRandomObject from 'src/common/utils/getRandomObject';
import { LoginDto } from './dto/login.dto';
import { faker } from '@faker-js/faker';
import {
  InvalidCredentialsException,
  UsernameTakenException,
} from './exceptions';
import { EnvModule } from 'src/env/env.module';
import { SignupDto } from './dto/signup.dto';

//
// integration test
//
describe('Auth REST', () => {
  let app: INestApplication;
  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
  };

  // init SUT app
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, EnvModule],
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
    const dto: LoginDto = {
      username: faker.person.firstName(),
      password: faker.string.sample(),
    };

    test('happy path', async () => {
      const mockLoginReturnedValue = getRandomObject();
      mockAuthService.login.mockResolvedValueOnce(mockLoginReturnedValue);
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto)
        .expect(200);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(response.body).toEqual(mockLoginReturnedValue);
    });

    test('invalid credentials', async () => {
      const error = new InvalidCredentialsException();
      mockAuthService.login.mockRejectedValue(error);
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto)
        .expect(401);
    });

    test('unknown error', async () => {
      const error = new Error();
      mockAuthService.login.mockRejectedValue(error);
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(dto)
        .expect(500);
    });
  });

  // signup
  describe('POST /auth/signup', () => {
    const dto: SignupDto = {
      username: faker.person.firstName().toLowerCase(),
      password: 'User1111$' + faker.string.alphanumeric(8),
    };

    test('happy path', async () => {
      const mockSignupReturnedValue = getRandomObject();
      mockAuthService.signup.mockResolvedValueOnce(mockSignupReturnedValue);
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201);
      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
      expect(response.body).toEqual(mockSignupReturnedValue);
    });

    test('username taken', async () => {
      const error = new UsernameTakenException();
      mockAuthService.signup.mockRejectedValue(error);
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(409);
    });

    test('unknown error', async () => {
      const error = new Error();
      mockAuthService.signup.mockRejectedValue(error);
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(500);
    });
  });
});
