import { type AxiosResponse } from 'axios';
type ApiConfig = {
    baseURL: string;
};
declare class ApiService {
    private readonly config;
    private readonly instance;
    constructor(config: ApiConfig);
    get: (path: string, params?: {}) => Promise<AxiosResponse<any, any>>;
    post: (path: string, data?: {}) => Promise<AxiosResponse>;
    put: (path: string, data?: {}) => Promise<AxiosResponse>;
    patch: (path: string, data?: {}) => Promise<AxiosResponse>;
    delete: (path: string, query?: {}) => Promise<AxiosResponse>;
}
export default ApiService;
