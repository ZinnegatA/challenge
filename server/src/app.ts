import express from 'express';
import authRouter from './routes/auth';
import runsRouter from './routes/runs';
import { initializeDatabase } from './services/database.service';
import { Server } from 'http';

const app = express();
const port = process.env.PORT;
let server: Server;

app.use(express.json());
app.use('/api/v1', authRouter);
app.use('/api/v1', runsRouter);

initializeDatabase()
  .then(() => {
    server = app.listen(port, () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
    throw new Error(error);
  });

export { app, server };
