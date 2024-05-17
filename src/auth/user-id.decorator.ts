import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.userId as string;
  },
);

export default UserId;