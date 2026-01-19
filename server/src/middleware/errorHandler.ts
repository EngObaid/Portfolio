import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/ApiResponse';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : (res.statusCode || 500);

  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  return errorResponse(
    res,
    err.message || 'Internal Server Error',
    statusCode,
    process.env.NODE_ENV === 'production' ? undefined : [{ stack: err.stack }]
  );
};
