import { faker } from '@faker-js/faker';
import { AuthInterceptor } from './auth.interceptor';
import {
  CallHandler,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';

//
// unit test
//
describe('AuthInterceptor.intercept()', () => {
  test('successful authorization', () => {
    const mockUserId = faker.string.uuid();
    const mockSecret = faker.string.sample();
    const mockJWT = sign({ sub: mockUserId }, mockSecret);
    const mockRequest = {
      headers: {
        authorization: `Bearer ${mockJWT}`,
      },
      userId: undefined,
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    const mockHandleReturnValue = faker.string.sample();
    const mockNext = {
      handle: jest.fn().mockReturnValue(mockHandleReturnValue),
    } as CallHandler;
    const mockEnvService = { jwtSecret: mockSecret } as any;
    const authInterceptor = new AuthInterceptor(mockEnvService);
    const actual = authInterceptor.intercept(mockContext, mockNext);
    expect(mockNext.handle).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(mockHandleReturnValue);
    expect(mockRequest.userId).toBe(mockUserId);
  });

  test('no `Authorization` header', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as ExecutionContext;
    const mockNext = {
      handle: () => {},
    } as CallHandler;
    const authInterceptor = new AuthInterceptor({} as any);
    expect(() => {
      authInterceptor.intercept(mockContext, mockNext);
    }).toThrow(UnauthorizedException);
  });

  test('non-bearer token', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: `NON-BEARER-TOKEN` } }),
      }),
    } as ExecutionContext;
    const mockNext = {
      handle: () => {},
    } as CallHandler;
    const authInterceptor = new AuthInterceptor({} as any);
    expect(() => {
      authInterceptor.intercept(mockContext, mockNext);
    }).toThrow(UnauthorizedException);
  });

  test('invalid access token', () => {
    const mockJWT = sign({ sub: faker.string.uuid() }, 'INVALID_JWT_SECRET');
    const mockRequest = {
      headers: {
        authorization: `Bearer ${mockJWT}`,
      },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    const mockNext = {
      handle: () => {},
    } as CallHandler;
    const mockEnvService = { jwtSecret: 'valid-jwt-secret' } as any;
    const authInterceptor = new AuthInterceptor(mockEnvService);
    expect(() => {
      authInterceptor.intercept(mockContext, mockNext);
    }).toThrow(UnauthorizedException);
  });
});
