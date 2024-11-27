import {Endpoint} from '../types';
import {HttpMethods} from '../enums';
import {ClassConstructor} from 'class-transformer';

const initialEndpoint: Endpoint = {
  handler: '',
  method: HttpMethods.GET,
  path: '',
  statusCode: 0,
  authOnly: false,
  streamable: false,
}

const createEndpointDecorator = (params:  Partial<Endpoint>) =>  {
    return function (target: any, propertyKey: string | symbol) {
      const endpoints: Endpoint[] = Reflect.getMetadata('endpoints', target.constructor) || [];
      const endpointIdx = endpoints.findIndex(({ handler }: Endpoint) => handler === propertyKey);
      
      if (endpointIdx === -1) {
        endpoints.push({
          ...initialEndpoint,
          handler: propertyKey,
          ...params,
        })
      } else {
        endpoints[endpointIdx] = {
          ...endpoints[endpointIdx],
          ...params,
        }
      }
      
      Reflect.defineMetadata('endpoints', endpoints, target.constructor);
    };
}

const createHttpMethodDecorator = (method: HttpMethods) =>  {
  return (path: string = '') => createEndpointDecorator({ method, path });
}

export const Get = createHttpMethodDecorator(HttpMethods.GET);

export const Post = createHttpMethodDecorator(HttpMethods.POST);

export const Put = createHttpMethodDecorator(HttpMethods.PUT);

export const Patch = createHttpMethodDecorator(HttpMethods.PATCH);

export const Delete = createHttpMethodDecorator(HttpMethods.DELETE);

export const RequireScopes = (requiredScopes: string[]) => createEndpointDecorator({ requiredScopes });

export const Streamable = () => createEndpointDecorator({ streamable: true });

export const StatusCode = (statusCode: number) => createEndpointDecorator({ statusCode });

export const AuthOnly = () => createEndpointDecorator({ authOnly: true });

export const ValidateDto = (dto: ClassConstructor<any>) => createEndpointDecorator({ dto });
