declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            NODE_ENV: 'development' | 'production';
            REDIS_URL: string;
            REDIS_HOST: string;
            REDIS_PORT: string;
            SECRET_FOR_JWT: string;
            PORT: string;
            HOST: string
        }
    }
}

export {}