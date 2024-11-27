"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConnections = exports.UploadedFiles = exports.UserScopes = exports.UserId = exports.Body = exports.Headers = exports.Query = exports.Param = exports.Res = exports.Req = void 0;
const createParamDecorator = (extractor) => {
    return function (key) {
        return function (target, propertyKey, parameterIndex) {
            const paramMetadata = Reflect.getMetadata('params', target.constructor) || {};
            if (!paramMetadata[propertyKey]) {
                paramMetadata[propertyKey] = [];
            }
            paramMetadata[propertyKey].push({
                index: parameterIndex,
                extractor: (req, res, userConnections) => extractor(req, key, res, userConnections),
            });
            Reflect.defineMetadata('params', paramMetadata, target.constructor);
        };
    };
};
exports.Req = createParamDecorator((req) => req);
exports.Res = createParamDecorator((_, __, res) => res);
exports.Param = createParamDecorator((req, key) => key ? req.params[key] : req.params);
exports.Query = createParamDecorator((req, key) => key ? req.query[key] : req.query);
exports.Headers = createParamDecorator((req, key) => key ? req.headers[key] : req.headers);
exports.Body = createParamDecorator((req) => req.body);
exports.UserId = createParamDecorator((req) => req.headers['x-user-id']);
exports.UserScopes = createParamDecorator((req) => req.headers['x-user-scopes']);
exports.UploadedFiles = createParamDecorator((req, key) => {
    const files = req.files;
    return key ? files === null || files === void 0 ? void 0 : files.find(f => f.fieldname === key) : files;
});
exports.UserConnections = createParamDecorator((req, _, __, userConnections) => {
    if (!userConnections) {
        throw new Error('UserConnections can be used only after calling "useUserSocket" method.');
    }
    return userConnections;
});
