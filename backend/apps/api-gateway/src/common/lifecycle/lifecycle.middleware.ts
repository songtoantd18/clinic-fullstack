import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LifecycleMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Lifecycle');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('1. [Middleware] Chạy đầu tiên - Xử lý thô request');
    next();
  }
}
