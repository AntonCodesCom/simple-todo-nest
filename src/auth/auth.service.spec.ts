import { fa, faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { initUser } from './entities/user.entity';
import { InvalidCredentialsException } from './exceptions';
import { sign } from 'jsonwebtoken';

//
// unit test (non-mocked 'argon2' and 'jsonwebtoken')
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
      password: 'valid-password',
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
        accessToken: sign({ sub: mockFoundUser.id }, mockEnvService.jwtSecret),
      });
      // TODO: handle JWT expiry
    });

    test('user not found', async () => {
      mockFindUniqueFn.mockResolvedValue(null);
      await expect(authService.login(loginDto)).rejects.toBeInstanceOf(
        InvalidCredentialsException,
      );
    });

    test(`passwords don't match`, async () => {
      mockFindUniqueFn.mockResolvedValue(
        await initUser({}, 'INVALID_PASSWORD'),
      );
      await expect(authService.login(loginDto)).rejects.toBeInstanceOf(
        InvalidCredentialsException,
      );
    });
  });
});
