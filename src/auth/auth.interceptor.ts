import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedException('No `Authorization` header.');
    }
    const authParts = authorization.split(' ');
    if (authParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Only `Bearer` token type is supported.');
    }
    const userId = authParts[1];
    if (!isUUID(userId)) {
      throw new UnauthorizedException('User ID must be a UUID.');
    }
    req.userId = userId as string;
    return next.handle();
  }
}
