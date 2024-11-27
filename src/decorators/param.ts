import { Request, Response } from 'express';
import { UserConnectionsType } from '../types';

type ExtractorFunction = (req: Request, key?: string, res?: Response, userConnections?: UserConnectionsType) => any;

const createParamDecorator = (extractor: ExtractorFunction) => {
  return function (key?: string): ParameterDecorator {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
      const paramMetadata = Reflect.getMetadata('params', target.constructor) || {};
      if (!paramMetadata[propertyKey]) {
        paramMetadata[propertyKey] = [];
      }
      paramMetadata[propertyKey].push({
        index: parameterIndex,
        extractor: (req: Request, res: Response, userConnections: UserConnectionsType) => extractor(req, key, res, userConnections),
      });

      Reflect.defineMetadata('params', paramMetadata, target.constructor);
    };
  };
};

export const Req = createParamDecorator((req: Request) => req);

export const Res = createParamDecorator((_, __, res?: Response) => res);

export const Param = createParamDecorator((req: Request, key) => key ? req.params[key] : req.params);

export const Query = createParamDecorator((req: Request, key) => key ? req.query[key] : req.query);

export const Headers = createParamDecorator((req: Request, key) => key ? req.headers[key] : req.headers);

export const Body = createParamDecorator((req: Request) => req.body);

export const UserId = createParamDecorator((req: Request) => req.headers['x-user-id']);

export const UserScopes = createParamDecorator((req: Request) => req.headers['x-user-scopes']);

export const UploadedFiles = createParamDecorator(
  (req: Request, key) => {
    const files = req.files as Express.Multer.File[];
    return key ? files?.find(f => f.fieldname === key) : files;
  }
);

export const UserConnections = createParamDecorator((req: Request, _, __, userConnections) => {
  if (!userConnections) {
    throw new Error('UserConnections can be used only after calling "useUserSocket" method.');
  }
  
  return userConnections;
});