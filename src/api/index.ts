import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { notification } from "ant-design-vue";
import { useUserAuthenticationStore } from "~/store/user/useUserAuthenticationStore";

export const axiosApiInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "api/v1/",
  paramsSerializer: {
    indexes: null,
  },
});
export const axiosBaseInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
});

const requestInterceptorHandler = (config: AxiosRequestConfig) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers!.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};
const responseErrorHandler = (error: AxiosError<any>) => {
  if (
    error.response?.status === 400 ||
    error.response?.status === 403 ||
    error.response?.data.responseStatus === "INVALID_CREDENTIALS_EXCEPTION"
  ) {
    const details = error.response.data.details;
    const detailsMessages = details
      ? Object.entries(details).map(([key, value]) => `${key}: ${value}`)
      : null;

    notification.error({
      message: detailsMessages || error.response.data.message,
    });
  }
};

axiosBaseInstance.interceptors.response.use(
  (response) => response,
  responseErrorHandler
);
axiosApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      const { refreshToken } = useUserAuthenticationStore();

      try {
        await refreshToken();

        return axiosApiInstance({
          url: originalRequest.url,
          baseURL: originalRequest.baseUrl,
          data: originalRequest.data
            ? JSON.parse(originalRequest.data)
            : originalRequest.data,
          method: originalRequest.method,
          params: originalRequest.params,
        });
      } catch (e) {
        return Promise.reject(error);
      }
    }

    responseErrorHandler(error);
    return Promise.reject(error);
  }
);

axiosApiInstance.interceptors.request.use(requestInterceptorHandler);
