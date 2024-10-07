import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { DEFAULT_TIMEOUT } from "../constants/defaultValues";

const request: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  responseType: "json",
});

request.interceptors.request.use(
  async function (config: InternalAxiosRequestConfig) {
    return config;
  },

  async function (error: string) {
    return await Promise.reject(error);
  }
);

export const appendArgsToUrl = (url: string, queryParams: any) => {
  const queryString: string[] = [];
  Object.keys(queryParams).forEach(function (key) {
    if (queryParams[key] !== null) {
      queryString.push(`${key}=${encodeURIComponent(queryParams[key])}`);
    }
  });
  if (!queryString.length) {
    return url;
  }
  return `${url}?${queryString.join("&")}`;
};

function post(
  url: string,
  data: object,
  config?: AxiosRequestConfig<object> | undefined
) {
  return request.post(url, data, config);
}
function get(
  url: string,
  parameter: object,
  config?: AxiosRequestConfig<object> | undefined
) {
  const finalUrl = appendArgsToUrl(url, parameter);
  return request.get(finalUrl, config);
}

function put(
  url: string,
  data: object,
  config?: AxiosRequestConfig<object> | undefined
) {
  return request.put(url, data, config);
}

function remove(url: string, config?: AxiosRequestConfig<object>) {
  return request.delete(url, config);
}

function patch(
  url: string,
  data: object,
  config?: AxiosRequestConfig<object> | undefined
) {
  return request.patch(url, data, config);
}

export default Object.freeze({
  get,
  post,
  put,
  remove,
  patch,
});
