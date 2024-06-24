import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { initUser } from './entities/user.entity';
import { InvalidCredentialsException } from './exceptions';
import * as argon2 from 'argon2';
import * as jsonwebtoken from 'jsonwebtoken';
import { SignupDto } from './dto/signup.dto';

//
// unit test (non-mocked 'argon2' and 'jsonwebtoken')
//
describe('AuthService', () => {
  const mockEnvService = { jwtSecret: faker.string.sample() };
  const mockFindUniqueFn = jest.fn();
  const mockCreateFn = jest.fn();
  const mockPrismaService = {
    user: {
      findUnique: mockFindUniqueFn,
      create: mockCreateFn,
    },
  };
  const authService = new AuthService(
    mockEnvService as any, // EnvService
    mockPrismaService as any, // PrismaService
  );

  // login
  describe('login()', () => {
    const loginDto: LoginDto = {
      username: faker.string.sample(),
      password: faker.string.sample(),
    };

    test('happy path', async () => {
      const mockFoundUser = await initUser({}, loginDto.password);
      mockFindUniqueFn.mockResolvedValueOnce(mockFoundUser);
      const actual = await authService.login(loginDto); // act
      expect(mockFindUniqueFn).toHaveBeenCalledWith({
        where: {
          username: loginDto.username,
        },
      });
      expect(actual).toEqual({
        username: mockFoundUser.username,
        accessToken: actual.accessToken, // asserting this below
      });
      const decoded = jsonwebtoken.verify(
        actual.accessToken,
        mockEnvService.jwtSecret,
      );
      expect(decoded.sub).toBe(mockFoundUser.id);
    });

    test('user not found', async () => {
      mockFindUniqueFn.mockResolvedValue(null);
      await expect(authService.login(loginDto)).rejects.toBeInstanceOf(
        InvalidCredentialsException,
      );
    });

    test(`passwords don't match`, async () => {
      mockFindUniqueFn.mockResolvedValue(
        await initUser({}, 'DIFFERENT_PASSWORD'),
      );
      await expect(authService.login(loginDto)).rejects.toBeInstanceOf(
        InvalidCredentialsException,
      );
    });
  });

  // signup
  describe('signup()', () => {
    const signupDto: SignupDto = {
      username: faker.string.sample(),
      password: faker.string.sample(),
    };

    test('happy path', async () => {
      const mockCreatedUser = await initUser({});
      mockCreateFn.mockResolvedValueOnce(mockCreatedUser);
      const actual = await authService.signup(signupDto); // act
      const actualPasswordHash =
        mockCreateFn.mock.lastCall[0].data.passwordHash;
      expect(mockCreateFn).toHaveBeenCalledWith({
        data: {
          username: signupDto.username,
          passwordHash: actualPasswordHash, // asserting this later (below)
        },
      });
      expect(await argon2.verify(actualPasswordHash, signupDto.password)).toBe(
        true,
      );
      expect(actual).toEqual({
        username: mockCreatedUser.username,
        accessToken: actual.accessToken, // asserting this later (below)
      });
      const decoded = jsonwebtoken.verify(
        actual.accessToken,
        mockEnvService.jwtSecret,
      );
      expect(decoded.sub).toBe(mockCreatedUser.id);
    });

    test.todo('username taken');

    test.todo('unknown Prisma error');
  });
});
