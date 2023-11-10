import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const config = {
    app: {
        port: process.env.PORT || 3000
    },
    orm: {
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    },
    test: {
        appUrl: process.env.APP_URL
    }

}