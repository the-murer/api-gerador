import { ValidationPipe, ArgumentMetadata } from '@nestjs/common';
import 'reflect-metadata';

export class AppValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (
      metadata.type === 'query' &&
      metadata.metatype &&
      typeof value === 'object' &&
      value !== null
    ) {
      const prototype = metadata.metatype.prototype;

      for (const key of Object.keys(value)) {
        const designType = Reflect.getMetadata('design:type', prototype, key);

        if (designType === Boolean && typeof value[key] === 'string') {
          value[key] = value[key] === 'true';
        }
      }
    }

    return super.transform(value, metadata);
  }
}
