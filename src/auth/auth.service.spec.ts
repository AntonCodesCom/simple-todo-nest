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
  const mockFindUniqueFn = jest.fn();
  const mockPrismaService = {
    user: {
      findUnique: mockFindUniqueFn,
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
      AuthService.verifyPassword = jest.fn().mockResolvedValue(true);
      const mockGenerateAccessTokenFn = jest.fn();
      AuthService.generateAccessToken = mockGenerateAccessTokenFn;
      const mockFoundUser = await initUser({});
      mockFindUniqueFn.mockResolvedValue(mockFoundUser);
      const actual = await authService.login(loginDto); // act
      expect(mockFindUniqueFn).toHaveBeenCalledTimes(1);
      expect(mockFindUniqueFn).toHaveBeenCalledWith({
        where: {
          username: loginDto.username,
        },
      });
      expect(AuthService.verifyPassword).toHaveBeenCalledTimes(1);
      expect(AuthService.verifyPassword).toHaveBeenCalledWith(
        mockFoundUser.passwordHash,
        loginDto.password,
      );
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

    test(`passwords don't match`, async () => {
      AuthService.verifyPassword = jest.fn().mockResolvedValue(false);
      mockFindUniqueFn.mockResolvedValue(await initUser({}));
      await expect(authService.login(loginDto)).rejects.toBeInstanceOf(
        InvalidCredentialsException,
      );
    });
  });
});
