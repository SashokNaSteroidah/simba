declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            NODE_ENV: 'development' | 'production';
            REDIS_URL: string;
            SECRET_FOR_JWT: string;
            PORT: string;
        }
    }
}

export {}