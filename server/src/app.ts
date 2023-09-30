import express from 'express';
import authRouter from './routes/auth';
import { initializeDatabase } from './services/database.service';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', authRouter);

initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express server is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
  });
