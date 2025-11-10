import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources';
import { 
  SEMRESATTRS_SERVICE_NAME, 
  SEMRESATTRS_SERVICE_NAMESPACE, 
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT 
} from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';

const resource = defaultResource().merge(
  resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: 'nest-base',
    [SEMRESATTRS_SERVICE_NAMESPACE]: 'api-gerador',
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: 'production',
  })
);

const traceExporter = new OTLPTraceExporter({
  url: `${process.env.OTLP_ENDPOINT}/v1/traces`,
  headers: {
    Authorization: process.env.OTLP_BASIC || '',
  },
});

const logExporter = new OTLPLogExporter({
  url: `${process.env.OTLP_ENDPOINT}/v1/logs`,
  headers: {
    Authorization: process.env.OTLP_BASIC || '',
  },
});

const sdk = new NodeSDK({
  resource,
  spanProcessor: new BatchSpanProcessor(traceExporter),
  logRecordProcessor: new BatchLogRecordProcessor(logExporter),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry desligado'))
    .catch((error) => console.error('Erro ao desligar OpenTelemetry', error))
    .finally(() => process.exit(0));
});

export default sdk;