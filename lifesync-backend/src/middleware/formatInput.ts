// src/middleware/formatInput.ts
import { Request, Response, NextFunction } from 'express';
import { capitalizeWords } from '../utils/formatters';

const fieldsToFormat = ['name', 'address', 'location'];

export const formatInputMiddleware = (req: Request, res: Response, next: NextFunction) => {
  fieldsToFormat.forEach((field) => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      req.body[field] = capitalizeWords(req.body[field].trim());
    }
  });
  next();
};
