"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyParams = void 0;
const applyParams = (target, methodName, req, res, userConnections) => {
    const paramMetadata = Reflect.getMetadata('params', target.constructor);
    const paramInfo = (paramMetadata === null || paramMetadata === void 0 ? void 0 : paramMetadata[methodName]) || [];
    return paramInfo
        .sort((a, b) => a.index - b.index)
        .map((param) => param.extractor(req, res, userConnections));
};
exports.applyParams = applyParams;
