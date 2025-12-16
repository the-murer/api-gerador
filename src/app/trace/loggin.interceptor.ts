// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { trace } from '@opentelemetry/api';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, headers, body } = req;
    const userAgent = headers['user-agent'] || '';
    const start = Date.now();

    const span = trace.getActiveSpan();
    const traceId = span?.spanContext().traceId || 'no-trace';

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const res = context.switchToHttp().getResponse();
          const duration = Date.now() - start;
          span!.end();
          this.logger.log(`SUCCESS ${method} ${url}`, {
            method,
            url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            traceId,
            result: JSON.stringify(data),
          });
        },
        error: (error) => {
          const duration = Date.now() - start;
          span!.end();

          this.logger.error(`ERROR ${method} ${url}`, error.stack, {
            method,
            url,
            body: JSON.stringify(body),
            duration: `${duration}ms`,
            error: error.message,
            traceId,
            userAgent: JSON.stringify(userAgent),
          });
        },
      }),
    );
  }
}
