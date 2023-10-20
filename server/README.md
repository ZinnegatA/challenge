# JS challenge server

## Env vars
- Environment vars in this project are stored in .$environment.env file 
(by default .development.env is used for dev)

- Env variables used by this project can be found in exampleEnv file

## Project setup
This project can be run in two ways:
    
### Docker-compose (not ready for development, rebuild is needed on code change)
1. Run
    ```
    docker-compose up -d
    ```

### Local run
1. Setup Postgres db:
    ```
    docker-compose up -d postgres
    ```
2. Run
    ```
    npm i
    npm run typeorm:migration:run
    npm run start:dev
    ```

### Tests
Config for tests by default should be stored in .test.env file

In order to run tests execute:
```
npm run test
```