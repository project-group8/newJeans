import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    next();
  }
}
