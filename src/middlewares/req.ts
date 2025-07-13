import { Request, RequestHandler, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/error';

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack = '';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack ?? '';
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack ?? '';
  }

  const errorResponse = {
    success: false,
    message,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack,
  };

  console.log(errorResponse);

  res.status(statusCode).json(errorResponse);
};
