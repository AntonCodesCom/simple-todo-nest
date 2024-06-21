import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { initUser } from './entities/user.entity';

//
// unit test
//
describe('AuthService', () => {
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
  const authService = new AuthService(mockPrismaService as any);

  // login
  describe('login()', () => {
    test('happy path', async () => {
      const loginDto: LoginDto = {
        username: faker.string.sample(),
        password: faker.string.sample(),
      };
      const mockFoundUser = await initUser({});
      mockFindUniqueFn.mockResolvedValue(mockFoundUser);
      const actual = await authService.login(loginDto);
      expect(mockFindUniqueFn).toHaveBeenCalledTimes(1);
      expect(mockFindUniqueFn).toHaveBeenCalledWith({
        where: {
          username: loginDto.username,
        },
      });
      expect(mockGenerateAccessTokenFn).toHaveBeenCalledTimes(1);
      expect(mockGenerateAccessTokenFn).toHaveBeenCalledWith(
        mockFoundUser.id,
        '',
      ); // TODO: jwtSecret
      expect(actual).toEqual({
        username: mockFoundUser.username,
        accessToken: mockGenerateAccessTokenFn(),
      });
    });
  });
});
