import { PipeTransform, Injectable, ArgumentMetadata, Logger } from '@nestjs/common';

@Injectable()
export class LifecyclePipe implements PipeTransform {
  private readonly logger = new Logger('Lifecycle');

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log('4. [Pipe] Validate hoặc Transform dữ liệu đầu vào');
    return value;
  }
}
