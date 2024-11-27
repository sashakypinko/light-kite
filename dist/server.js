"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightKiteServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const inversify_1 = require("inversify");
const apply_params_1 = require("./utils/apply-params");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const exceptions_1 = require("./exceptions");
const middlewares_1 = require("./middlewares");
const convert_validation_errors_1 = require("./utils/convert-validation-errors");
const validation_exception_1 = __importDefault(require("./exceptions/validation.exception"));
class LightKiteServer {
    constructor(modules) {
        this.modules = modules;
        this.iocContainer = new inversify_1.Container();
        this.express = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.express);
        this.initialize();
    }
    initialize() {
        this.setMiddlewares();
        this.registerServices();
        this.registerControllers();
    }
    useUserSocket(jwtSecret, options) {
        const io = new socket_io_1.Server(this.httpServer, options);
        this.userConnections = new Map();
        io.use(this.createSocketAuthMiddleware(jwtSecret));
        io.on('connection', (socket) => this.handleSocketConnection(socket));
    }
    run(port, callback) {
        this.setupControllerRoutes();
        this.express.use(middlewares_1.handleErrorsMiddleware);
        this.httpServer.listen(port, callback);
    }
    setMiddlewares() {
        var _a;
        this.express.use((0, cors_1.default)());
        this.express.use(express_1.default.json());
        (_a = this.modules.middlewares) === null || _a === void 0 ? void 0 : _a.forEach((middleware) => {
            this.express.use(middleware);
        });
    }
    registerServices() {
        var _a;
        (_a = this.modules.services) === null || _a === void 0 ? void 0 : _a.forEach((service) => {
            if (isServiceModule(service)) {
                const { Service, TypeSymbol } = service;
                this.iocContainer.bind(TypeSymbol).to(Service);
            }
            else {
                this.iocContainer.bind(Symbol.for(service.name)).to(service);
            }
        });
    }
    registerControllers() {
        var _a;
        (_a = this.modules.controllers) === null || _a === void 0 ? void 0 : _a.forEach((Controller) => {
            const controllerSymbol = Symbol.for(Controller.name);
            this.iocContainer.bind(controllerSymbol).to(Controller);
        });
    }
    setupControllerRoutes() {
        var _a;
        (_a = this.modules.controllers) === null || _a === void 0 ? void 0 : _a.forEach((Controller) => {
            const controllerPath = Reflect.getMetadata('controller', Controller);
            const endpoints = Reflect.getMetadata('endpoints', Controller);
            if (!endpoints) {
                throw new Error(`Controller metadata is missing for ${Controller.name}`);
            }
            const controllerInstance = this.iocContainer.get(Symbol.for(Controller.name));
            endpoints.forEach((endpoint) => this.setupEndpoint(controllerInstance, controllerPath, endpoint));
        });
    }
    setupEndpoint(controllerInstance, controllerPath, endpoint) {
        const { method, path, statusCode, handler, authOnly, streamable, dto, requiredScopes } = endpoint;
        const routePath = `${controllerPath}/${path}`;
        this.express[method](routePath, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (authOnly)
                    this.handleAuthorization(req, requiredScopes);
                if (dto)
                    yield this.validateDto(req, dto);
                const params = (0, apply_params_1.applyParams)(controllerInstance, handler, req, res, this.userConnections);
                const result = yield controllerInstance[handler](...params);
                if (!streamable)
                    res.status(statusCode || 200).json({ success: true, data: result });
            }
            catch (err) {
                next(err);
            }
        }));
    }
    createSocketAuthMiddleware(jwtSecret) {
        return (socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token not provided'));
            }
            try {
                socket.data.auth = jsonwebtoken_1.default.verify(token, jwtSecret);
                next();
            }
            catch (err) {
                return next(new Error('Authentication error: Invalid token'));
            }
        };
    }
    handleSocketConnection(socket) {
        const { userId } = socket.data.auth;
        this.userConnections.set(userId, socket);
        socket.on('disconnect', () => {
            this.userConnections.delete(userId);
        });
    }
    handleAuthorization(req, requiredScopes) {
        var _a;
        const userId = req.headers['x-user-id'];
        const userScopes = (_a = req.headers['x-user-scopes']) === null || _a === void 0 ? void 0 : _a.split(',');
        if (!userId)
            throw new exceptions_1.UnauthorizedException();
        if (requiredScopes && !(userScopes === null || userScopes === void 0 ? void 0 : userScopes.some((scope) => requiredScopes.includes(scope)))) {
            throw new exceptions_1.AccessDeniedException();
        }
    }
    validateDto(req, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtoInstance = (0, class_transformer_1.plainToInstance)(dto, Object.assign(Object.assign({}, req.body), req.query));
            const errors = yield (0, class_validator_1.validate)(dtoInstance);
            if (errors.length > 0) {
                throw new validation_exception_1.default((0, convert_validation_errors_1.convertValidationErrors)(errors));
            }
        });
    }
}
exports.LightKiteServer = LightKiteServer;
function isServiceModule(service) {
    return service.Service !== undefined && service.TypeSymbol !== undefined;
}
const lightKiteServer = (modules) => new LightKiteServer(modules);
exports.default = lightKiteServer;
