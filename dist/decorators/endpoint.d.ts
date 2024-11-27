import { ClassConstructor } from 'class-transformer';
export declare const Get: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Post: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Put: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Patch: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Delete: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const RequireScopes: (requiredScopes: string[]) => (target: any, propertyKey: string | symbol) => void;
export declare const Streamable: () => (target: any, propertyKey: string | symbol) => void;
export declare const StatusCode: (statusCode: number) => (target: any, propertyKey: string | symbol) => void;
export declare const AuthOnly: () => (target: any, propertyKey: string | symbol) => void;
export declare const ValidateDto: (dto: ClassConstructor<any>) => (target: any, propertyKey: string | symbol) => void;
