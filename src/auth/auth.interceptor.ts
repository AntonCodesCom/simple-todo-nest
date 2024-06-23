import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { EnvService } from 'src/env/env.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly envService: EnvService) {}

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
    const accessToken = authParts[1];
    try {
      const decoded = verify(accessToken, this.envService.jwtSecret);
      req.userId = decoded.sub as string;
      return next.handle();
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
