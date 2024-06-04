import { faker } from '@faker-js/faker';
import { AuthInterceptor } from './auth.interceptor';
import {
  CallHandler,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

//
// unit test
//
describe('AuthInterceptor.intercept()', () => {
  test.todo('successful authorization');

  test('no `Authorization` header', () => {
    const mockRequest = new Request(faker.internet.url());
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    const mockNext = {
      handle: () => {},
    } as CallHandler;
    const authInterceptor = new AuthInterceptor();
    expect(() => {
      authInterceptor.intercept(mockContext, mockNext);
    }).toThrow(UnauthorizedException);
  });

  test.todo('non-bearer token');

  test.todo('invalid access token');
});
