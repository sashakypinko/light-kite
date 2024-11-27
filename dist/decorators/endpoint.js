"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateDto = exports.AuthOnly = exports.StatusCode = exports.Streamable = exports.RequireScopes = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = void 0;
const enums_1 = require("../enums");
const initialEndpoint = {
    handler: '',
    method: enums_1.HttpMethods.GET,
    path: '',
    statusCode: 0,
    authOnly: false,
    streamable: false,
};
const createEndpointDecorator = (params) => {
    return function (target, propertyKey) {
        const endpoints = Reflect.getMetadata('endpoints', target.constructor) || [];
        const endpointIdx = endpoints.findIndex(({ handler }) => handler === propertyKey);
        if (endpointIdx === -1) {
            endpoints.push(Object.assign(Object.assign(Object.assign({}, initialEndpoint), { handler: propertyKey }), params));
        }
        else {
            endpoints[endpointIdx] = Object.assign(Object.assign({}, endpoints[endpointIdx]), params);
        }
        Reflect.defineMetadata('endpoints', endpoints, target.constructor);
    };
};
const createHttpMethodDecorator = (method) => {
    return (path = '') => createEndpointDecorator({ method, path });
};
exports.Get = createHttpMethodDecorator(enums_1.HttpMethods.GET);
exports.Post = createHttpMethodDecorator(enums_1.HttpMethods.POST);
exports.Put = createHttpMethodDecorator(enums_1.HttpMethods.PUT);
exports.Patch = createHttpMethodDecorator(enums_1.HttpMethods.PATCH);
exports.Delete = createHttpMethodDecorator(enums_1.HttpMethods.DELETE);
const RequireScopes = (requiredScopes) => createEndpointDecorator({ requiredScopes });
exports.RequireScopes = RequireScopes;
const Streamable = () => createEndpointDecorator({ streamable: true });
exports.Streamable = Streamable;
const StatusCode = (statusCode) => createEndpointDecorator({ statusCode });
exports.StatusCode = StatusCode;
const AuthOnly = () => createEndpointDecorator({ authOnly: true });
exports.AuthOnly = AuthOnly;
const ValidateDto = (dto) => createEndpointDecorator({ dto });
exports.ValidateDto = ValidateDto;
