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
const axios_1 = __importDefault(require("axios"));
class ApiService {
    constructor(config) {
        this.config = config;
        this.get = (path, params = {}) => __awaiter(this, void 0, void 0, function* () {
            return yield this.instance.get(path, { params });
        });
        this.post = (path, data = {}) => __awaiter(this, void 0, void 0, function* () {
            return yield this.instance.post(path, data);
        });
        this.put = (path, data = {}) => __awaiter(this, void 0, void 0, function* () {
            return yield this.instance.put(path, data);
        });
        this.patch = (path, data = {}) => __awaiter(this, void 0, void 0, function* () {
            return yield this.instance.patch(path, data);
        });
        this.delete = (path, query = {}) => __awaiter(this, void 0, void 0, function* () {
            return yield this.instance.delete(path, query);
        });
        this.instance = axios_1.default.create({
            baseURL: this.config.baseURL, headers: {
                'x-system-call': true,
            },
        });
    }
}
exports.default = ApiService;
