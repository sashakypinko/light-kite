import { Request, Response } from 'express';
import { UserConnectionsType } from '../types';
export declare const applyParams: (target: any, methodName: string, req: Request, res: Response, userConnections: UserConnectionsType) => any[];
