import { ServerOptions } from 'socket.io';
import { LightKiteServerInterface, ServerModules } from './types';
export declare class LightKiteServer implements LightKiteServerInterface {
    private readonly modules;
    private readonly iocContainer;
    private readonly express;
    private readonly httpServer;
    private userConnections;
    constructor(modules: ServerModules);
    private initialize;
    useUserSocket(jwtSecret: string, options?: Partial<ServerOptions>): void;
    run(port: number, callback: () => void): void;
    private setMiddlewares;
    private registerServices;
    private registerControllers;
    private setupControllerRoutes;
    private setupEndpoint;
    private createSocketAuthMiddleware;
    private handleSocketConnection;
    private handleAuthorization;
    private validateDto;
}
declare const lightKiteServer: (modules: ServerModules) => LightKiteServer;
export default lightKiteServer;
