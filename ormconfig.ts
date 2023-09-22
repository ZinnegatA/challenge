module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'challenge',
  synchronize: true,
  logging: true,
  entities: ['src/server/entities/**/*.ts'],
  migrations: ['src/server/migrations/**/*.ts'],
  subscribers: ['src/server/subscribers/**/*.ts'],
  cli: {
    entitiesDir: 'src/server/entities',
    migrationsDir: 'src/server/migrations',
    subscribersDir: 'src/server/subscribers',
  },
};
