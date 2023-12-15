import express from 'express';
import authRouter from './routes/auth';
import runsRouter from './routes/runs';
import tasksRouter from './routes/tasks';
import { initializeDatabase } from './services/database.service';
import { config } from './config/config';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import swaggerDocs from './docs/swagger.json';

const app = express();
const port = config.app.port;

const apiBase = '/api/v1';

app.use(`${apiBase}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use(cookieParser());
app.use(apiBase, authRouter);
app.use(apiBase, runsRouter);
app.use(apiBase, tasksRouter);

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
    throw new Error(error);
  });

export { app };
