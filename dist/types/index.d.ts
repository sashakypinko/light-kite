import { RequestHandler } from 'express';
import { HttpMethods } from '../enums';
import { ClassConstructor } from 'class-transformer';
import { Socket } from 'socket.io';
export type Class<T> = new (...args: any[]) => T;
export type ServiceModule<T = any> = Class<T> | {
    Service: Class<T>;
    TypeSymbol: symbol;
};
export interface ServerModules {
    middlewares?: RequestHandler[];
    controllers?: Class<any>[];
    services?: ServiceModule[];
}
export interface Endpoint {
    handler: string | symbol;
    method: HttpMethods;
    path: string;
    statusCode: number;
    authOnly: boolean;
    streamable: boolean;
    requiredScopes?: string[];
    dto?: ClassConstructor<any>;
}
export interface LightKiteServerInterface {
    useUserSocket: (jwtSecret: string) => void;
    run: (port: number, callback: () => void) => void;
}
export type ValidationResult = {
    [key: string]: string;
};
export type UserConnectionsType = Map<string, Socket>;
