// logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger = logs.getLogger('nest-app');

  private emitLog(level: string, message: string, meta?: any) {
    const span = trace.getActiveSpan();
    const record: any = {
      severityText: level,
      body: message,
      attributes: {
        'log.level': level,
        ...meta,
      },
    };

    if (span) {
      const spanContext = span.spanContext();
      record.traceId = spanContext.traceId;
      record.spanId = spanContext.spanId;
      record.traceFlags = spanContext.traceFlags;
    }

    this.logger.emit(record);
    
    // Console para desenvolvimento
    console.log(`[${level}] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  log(message: string, meta?: any) {
    this.emitLog('INFO', message, meta);
  }

  error(message: string, trace?: string, meta?: any) {
    this.emitLog('ERROR', message, { trace, ...meta });
  }

  warn(message: string, meta?: any) {
    this.emitLog('WARN', message, meta);
  }

  debug(message: string, meta?: any) {
    this.emitLog('DEBUG', message, meta);
  }

  verbose(message: string, meta?: any) {
    this.emitLog('VERBOSE', message, meta);
  }
}