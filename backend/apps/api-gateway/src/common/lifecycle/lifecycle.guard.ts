import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LifecycleGuard implements CanActivate {
  private readonly logger = new Logger('Lifecycle');

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log('2. [Guard] Kiểm tra quyền truy cập (Authentication/Authorization)');
    return true;
  }
}
