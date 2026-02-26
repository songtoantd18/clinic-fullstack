import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LifecycleInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Lifecycle');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('3. [Interceptor - Trước] Trước khi vào Controller');
    
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`6. [Interceptor - Sau] Sau khi Controller xử lý xong... (${Date.now() - now}ms)`);
      }),
    );
  }
}
