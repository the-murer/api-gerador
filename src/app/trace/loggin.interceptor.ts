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

    this.logger.log('Requisição recebida', {
      method,
      url,
      userAgent,
      traceId,
      body: JSON.stringify(body),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const res = context.switchToHttp().getResponse();
          const duration = Date.now() - start;
          
          this.logger.log('Requisição finalizada', {
            method,
            url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            traceId,
          });
        },
        error: (error) => {
          const duration = Date.now() - start;
          
          this.logger.error('Requisição com erro', error.stack, {
            method,
            url,
            duration: `${duration}ms`,
            error: error.message,
            traceId,
          });
        },
      })
    );
  }
}