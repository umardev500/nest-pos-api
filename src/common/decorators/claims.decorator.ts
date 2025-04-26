// src/common/decorators/user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClaimsDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
