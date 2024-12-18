import {NextFunction, Request, Response} from 'express';
import {HttpException} from '../exceptions';
import ValidationException from '../exceptions/validation.exception';

const handleErrorsMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  if (error instanceof ValidationException) {
    res.status(error.statusCode).json({ success: false, errors: error.errors });
  } else if (error instanceof HttpException) {
    res.status(error.statusCode).json({ success: false, error: error.message });
  } else {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

export default handleErrorsMiddleware;
