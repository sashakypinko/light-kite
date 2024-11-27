import axios, {type AxiosInstance, type AxiosResponse} from 'axios';

type ApiConfig = {
  baseURL: string;
}

class ApiService {
  private readonly instance: AxiosInstance;

  constructor(private readonly config: ApiConfig) {
    this.instance = axios.create({
      baseURL: this.config.baseURL, headers: {
        'x-system-call': true,
      },
    });
  }

  get = async (path: string, params = {}) => {
    return await this.instance.get(path, {params});
  };

  post = async (path: string, data = {}): Promise<AxiosResponse> => {
    return await this.instance.post(path, data);
  };

  put = async (path: string, data = {}): Promise<AxiosResponse> => {
    return await this.instance.put(path, data);
  };

  patch = async (path: string, data = {}): Promise<AxiosResponse> => {
    return await this.instance.patch(path, data);
  };

  delete = async (path: string, query = {}): Promise<AxiosResponse> => {
    return await this.instance.delete(path, query);
  };
}

export default ApiService;