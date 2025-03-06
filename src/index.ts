import express from 'express';
import routes from './routes';
import { config } from './config/config';

const app = express();
app.use(express.json());

// Use routes
app.use('/api', routes);

// Error-handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});