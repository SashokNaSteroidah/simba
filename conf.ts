
export const config = {
    GENERAL: {
        auth_host: process.env.AUTH_HOST,
        auth_port: process.env.AUTH_PORT,
        main_port: process.env.MAIN_PORT,
        main_host: process.env.MAIN_HOST,
        secret_for_jwt: process.env.SECRET_FOR_JWT,
        destination: "/backups/database",
        encrypt: false,
        region: process.env.AWS_REGION
    },
    AUTH: {
        redis_port_auth: process.env.AUTH_REDIS_PORT,
        redis_host_auth: process.env.AUTH_REDIS_HOST,
        redis_url_auth: process.env.AUTH_REDIS_URL,
    },
    TRACE: {
        url: process.env.URL_OTEL_TRACES
    }
};