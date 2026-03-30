import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { error } from '../utils/response.js';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = (err.errors || []).map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return error(res, 'Validation failed', 400, { details });
      }
      return error(res, 'Internal validation error', 500);
    }
  };
};
