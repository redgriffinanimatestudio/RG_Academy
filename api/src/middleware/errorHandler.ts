import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const status = err.status || err.statusCode || 500;
  
  // Log full error details for internal audit
  console.error(`--- [${new Date().toISOString()}] SERVER ERROR ---`);
  console.error('Path:', req.path);
  console.error('Status:', status);
  console.error('Message:', err.message);
  if (err.stack) console.error('Stack:', err.stack);
  console.error('-------------------------------------------');

  // Sanitize the message for the client in production
  let clientMessage = err.message;
  if (isProduction && status === 500) {
    clientMessage = 'An internal server error occurred. Please try again later.';
  }

  res.status(status).json({
    success: false,
    error: clientMessage,
    // Stack is strictly for development
    stack: !isProduction ? err.stack : undefined
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
