import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import getUrlConfig from "@/constants/network/cms";

const urlConfig = getUrlConfig();
class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { baseURL: "/api", timeout: 10000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign({}, this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error(`something were wrong when fetch ${config?.url}`, error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const res = response.data;
        const { code, data, message: errorMessage } = response.data;
        switch (code) {
          case "20000":
            return res;
          case "20001":
            return {};
          case "50000":
            return null;
          default:
            // message.error(errorMessage);
            return res;
        }
      },
      (error) => {
        let errMessage = "";
        switch (error?.response?.status) {
          case 400:
            errMessage = "Bad Request";
            break;

          case 401:
            // message.error("The signature has expired. Please log in again.");
            setTimeout(() => {
              location.pathname = "/";
            }, 3000);
            break;

          case 404:
            errMessage = "Not Found";
            break;

          case 500:
          case 501:
          case 502:
          case 503:
          case 504:
            errMessage = `${error.response.status}: something is wrong in server`;
            break;

          default:
            errMessage = `${error.response.status}: something is wrong, please try again later`;
            break;
        }

        // message.error(errMessage);
        return Promise.reject(errMessage);
      }
    );
  }

  public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public post<T, R>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.post(url, data, config);
  }

  public put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
  public patch<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, config);
  }
}

const apiServer = new Request({
  baseURL: urlConfig.cms + "/",
});

const webflowAPI = new Request({
  baseURL: urlConfig.webflow + "/",
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_WEBFLOW_API_TOKEN}`,
    'accept-version': '1.0.0',
  }
});

const defaultRequest = new Request({});
export default defaultRequest;
export { apiServer, webflowAPI };
