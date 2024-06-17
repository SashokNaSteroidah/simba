declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV: 'development' | 'production';

      MAIN_PORT: string;
      MAIN_HOST: string;

      AUTH_PORT: string,
      AUTH_HOST: string,
      AUTH_REDIS_URL: string;
      AUTH_REDIS_HOST: string;
      AUTH_REDIS_PORT: string;

      URL_OTEL_TRACES: string

      SECRET_FOR_JWT: string;

      AWS_REGION: string

      GRAFANA_URL: string
    }
  }
}

export {};
