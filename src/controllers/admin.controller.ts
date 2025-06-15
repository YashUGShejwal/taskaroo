import { Request, Response, NextFunction } from 'express';

export const getReports = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ data: 'Confidential Admin Reports' });
  } catch (err) {
    next(err);
  }
};
