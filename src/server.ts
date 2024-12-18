import express, {Application, Express, NextFunction, Request, Response} from 'express';
import {createServer, Server as HttpServer} from 'http';
import {Server, ServerOptions, Socket} from 'socket.io';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import {Container} from 'inversify';

import {applyParams} from './utils/apply-params';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {Class, Endpoint, LightKiteServerInterface, ServerModules, ServiceModule, UserConnectionsType} from './types';
import {AccessDeniedException, UnauthorizedException} from './exceptions';
import {handleErrorsMiddleware} from './middlewares';
import {convertValidationErrors} from './utils/convert-validation-errors';
import ValidationException from './exceptions/validation.exception';

export class LightKiteServer implements LightKiteServerInterface {
  private readonly iocContainer: Container;
  private readonly express: Express;
  private readonly httpServer: HttpServer;
  private userConnections: UserConnectionsType;

  constructor(private readonly modules: ServerModules) {
    this.iocContainer = new Container();
    this.express = express();
    this.httpServer = createServer(this.express);

    this.initialize();
  }

  private initialize() {
    this.setMiddlewares();
    this.registerServices();
    this.registerControllers();
  }

  useUserSocket(jwtSecret: string, options?: Partial<ServerOptions>) {
    const io = new Server(this.httpServer, options);
    this.userConnections = new Map();

    io.use(this.createSocketAuthMiddleware(jwtSecret));

    io.on('connection', (socket) => this.handleSocketConnection(socket));
  }

  run(port: number, callback: () => void): void {
    this.setupControllerRoutes();
    this.express.use(handleErrorsMiddleware);
    this.httpServer.listen(port, callback);
  }

  private setMiddlewares() {
    this.express.use(cors());
    this.express.use(express.json());

    this.modules.middlewares?.forEach((middleware) => {
      this.express.use(middleware);
    });
  }

  private registerServices() {
    this.modules.services?.forEach((service) => {
      if (isServiceModule(service)) {
        const { Service, TypeSymbol } = service;
        this.iocContainer.bind(TypeSymbol).to(Service);
      } else {
        this.iocContainer.bind(Symbol.for(service.name)).to(service);
      }
    });
  }

  private registerControllers() {
    this.modules.controllers?.forEach((Controller) => {
      const controllerSymbol = Symbol.for(Controller.name);
      this.iocContainer.bind(controllerSymbol).to(Controller);
    });
  }

  private setupControllerRoutes() {
    this.modules.controllers?.forEach((Controller) => {
      const controllerPath = Reflect.getMetadata('controller', Controller);
      const endpoints: Endpoint[] = Reflect.getMetadata('endpoints', Controller);

      if (!endpoints) {
        throw new Error(`Controller metadata is missing for ${Controller.name}`);
      }

      const controllerInstance = this.iocContainer.get<any>(Symbol.for(Controller.name));
      endpoints.forEach((endpoint) =>
        this.setupEndpoint(controllerInstance, controllerPath, endpoint)
      );
    });
  }

  private setupEndpoint(controllerInstance: any, controllerPath: string, endpoint: Endpoint) {
    const { method, path, statusCode, handler, authOnly, streamable, dto, requiredScopes } = endpoint;
    const routePath = `${controllerPath}/${path}`;

    this.express[method as keyof Application](routePath, async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (authOnly) this.handleAuthorization(req, requiredScopes);
        if (dto) await this.validateDto(req, dto);

        const params = applyParams(controllerInstance, handler as string, req, res, this.userConnections);
        const result = await controllerInstance[handler](...params);

        if (!streamable) res.status(statusCode || 200).json({ success: true, data: result });
      } catch (err) {
        next(err);
      }
    });
  }

  private createSocketAuthMiddleware(jwtSecret: string) {
    return (socket: Socket, next: (err?: Error) => void) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }

      try {
        socket.data.auth = jwt.verify(token, jwtSecret);
        next();
      } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
    };
  }

  private handleSocketConnection(socket: Socket) {
    const { userId } = socket.data.auth;

    this.userConnections.set(userId, socket);

    socket.on('disconnect', () => {
      this.userConnections.delete(userId);
    });
  }

  private handleAuthorization(req: Request, requiredScopes?: string[]) {
    if (req.headers['x-system-call']) return;
    
    const userId = req.headers['x-user-id'];
    const userScopes = (req.headers['x-user-scopes'] as string)?.split(',') as string[];

    if (!userId) throw new UnauthorizedException();

    if (requiredScopes && !userScopes?.some((scope) => requiredScopes.includes(scope))) {
      throw new AccessDeniedException();
    }
  }

  private async validateDto(req: Request, dto: ClassConstructor<any>) {
    const dtoInstance = plainToInstance(dto, { ...req.body, ...req.query });
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationException(convertValidationErrors(errors));
    }
  }
}

function isServiceModule(service: ServiceModule): service is { Service: Class<any>; TypeSymbol: symbol } {
  return (service as any).Service !== undefined && (service as any).TypeSymbol !== undefined;
}

const lightKiteServer = (modules: ServerModules) => new LightKiteServer(modules);

export default lightKiteServer;