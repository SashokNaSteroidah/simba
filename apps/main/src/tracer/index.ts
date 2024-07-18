'use strict';

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node";

const exporterOptions = {
    url: process.env.URL_OTEL_TRACES
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
        getNodeAutoInstrumentations({
            // only instrument fs if it is part of another trace
            '@opentelemetry/instrumentation-fs': {
                requireParentSpan: true,
            },
        }),
        new NestInstrumentation(),
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
    ],
    resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: 'main-service',
    }),
});

sdk.start();

process.on('SIGTERM', () => {
    sdk
        .shutdown()
        .then(() => console.debug('Tracing terminated'))
        .catch((error) => console.error('Error terminating tracing', error))
        .finally(() => process.exit(0));
});

export default sdk;

