"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Controller = (path = '') => {
    return function (target) {
        (0, inversify_1.injectable)()(target);
        Reflect.defineMetadata('controller', path, target);
    };
};
exports.default = Controller;
