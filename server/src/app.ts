import express from 'express';
import authRouter from './routes/auth';
import runsRouter from './routes/runs';
import tasksRouter from './routes/tasks';
import { initializeDatabase } from './services/database.service';
import { config } from './config/config';

const app = express();
const port = config.app.port;

const apiBase = '/api/v1';

app.use(express.json());
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
