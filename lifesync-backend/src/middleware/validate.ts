import { ZodTypeAny, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
      }
      req.body = result.data; // type-safe and validated
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ errors: err.flatten().fieldErrors });
      }
      next(err);
    }
  };
}
