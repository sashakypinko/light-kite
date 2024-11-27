import {Request, Response} from 'express';
import {UserConnectionsType} from '../types';

interface ParamMetadata {
  index: number;
  extractor: (req: Request, res: Response, userConnections: UserConnectionsType) => any;
}

export const applyParams = (target: any, methodName: string, req: Request, res: Response, userConnections: UserConnectionsType): any[] => {
  const paramMetadata = Reflect.getMetadata('params', target.constructor);

  const paramInfo = paramMetadata?.[methodName] || [];
  
  return paramInfo
    .sort((a: ParamMetadata, b: ParamMetadata) => a.index - b.index)
    .map((param: ParamMetadata) => param.extractor(req, res, userConnections));
}