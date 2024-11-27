import { NextFunction, Request, Response } from 'express';
declare const handleErrorsMiddleware: (error: any, req: Request, res: Response, next: NextFunction) => void;
export default handleErrorsMiddleware;
