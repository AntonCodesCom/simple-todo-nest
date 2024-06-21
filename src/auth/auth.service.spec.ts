import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { initUser } from './entities/user.entity';
import { InvalidCredentialsException } from './exceptions';

//
// unit test
//
describe('AuthService', () => {
  const mockEnvService = { jwtSecret: faker.string.sample() };
  const mockFindUniqueFn = jest.fn(); //.mockResolvedValue(mockTodos);
  const mockPrismaService = {
    user: {
      findUnique: mockFindUniqueFn,
    },
  };
  const mockVerifyPasswordFn = jest.fn();
  AuthService.verifyPassword = mockVerifyPasswordFn;
  const mockGenerateAccessTokenFn = jest.fn();
  AuthService.generateAccessToken = mockGenerateAccessTokenFn;
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
      const mockFoundUser = await initUser({});
      mockFindUniqueFn.mockResolvedValue(mockFoundUser);
      const actual = await authService.login(loginDto); // act
      expect(mockFindUniqueFn).toHaveBeenCalledTimes(1);
      expect(mockFindUniqueFn).toHaveBeenCalledWith({
        where: {
          username: loginDto.username,
        },
      });
      expect(mockGenerateAccessTokenFn).toHaveBeenCalledTimes(1);
      expect(mockGenerateAccessTokenFn).toHaveBeenCalledWith(
        mockFoundUser.id,
        mockEnvService.jwtSecret,
      );
      expect(actual).toEqual({
        username: mockFoundUser.username,
        accessToken: mockGenerateAccessTokenFn(),
      });
    });

    test('user not found', async () => {
      mockFindUniqueFn.mockResolvedValue(null);
      await expect(authService.login(loginDto)).rejects.toBeInstanceOf(
        InvalidCredentialsException,
      );
    });

    test.todo(`passwords don't match`);
  });
});
