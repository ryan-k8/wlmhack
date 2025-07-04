//TODO: fix typing issue for request handlers
//TODO: add centralized error handling and refactor try catch in controllers

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import morgan from 'morgan';

import routes from './routes/index';

import mongoose from 'mongoose';
import { authMiddleware } from './middlewares/auth';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Use the routes defined in the routes directory
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express + MongoDB!');
});

app.get('/protected', authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: 'This is a protected route',
    user: (req as any).user || 'No user data available',
  });
});

// Start the server
const PORT = process.env.PORT || 3000;

try {
  mongoose.connect(process.env.MONGODB_URI as string).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
}

export default app;
