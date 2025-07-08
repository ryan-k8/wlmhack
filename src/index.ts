//TODO: migrate the controllers logic to new approach

import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import morgan from 'morgan';
import mongoose from 'mongoose';

import routes from './routes/index';
import { wrapRouter } from './utils/router';
import { asyncHandler, errorHandler } from './middlewares/req';
import { ApiError } from './utils/error';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Use the routes defined in the routes directory
app.use('/api', wrapRouter(routes, asyncHandler));

app.use(
  '/error-test',
  asyncHandler(
    async (
      req: Request<{}, {}, { statusCode: number | undefined }>,
      res: Response,
      next: NextFunction,
    ) => {
      let { statusCode } = req.body;
      if (!statusCode) {
        statusCode = 500; // Default to 500 if no status code is provided
      }
      next(new ApiError(statusCode, 'This is a test error', false));
    },
  ),
);

//central error handling middleware
app.use(errorHandler);

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
