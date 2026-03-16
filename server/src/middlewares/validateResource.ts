import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validateResource = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: e.issues.map(err => ({
            path: err.path[1],
            message: err.message
          }))
        });
      }
      return res.status(500).send(e.message);
    }
  };