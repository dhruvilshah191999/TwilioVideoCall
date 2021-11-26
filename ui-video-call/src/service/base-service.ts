import axios, { AxiosError, AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    showLoader: boolean;
  }
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.url) {
      config.url = process.env.REACT_APP_BASE_URL + config.url;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};
