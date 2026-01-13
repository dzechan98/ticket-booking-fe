import axios from "axios";

export const getEndpoint = () => {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
};

const instance = axios.create({
  baseURL: getEndpoint(),
  headers: {
    "Content-Type": "application/json",
  },
});

const createRequestInterceptor = () => {
  instance.interceptors.request.use(
    (config: any) => {
      config.headers = config.headers ?? {};
      const accessToken = localStorage.getItem("accessToken") ?? "";
      config.headers.Authorization = `Bearer ${accessToken}`;

      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

const createResponseInterceptor = () => {
  instance.interceptors.response.use((response: any) => {
    return response;
  });
};

createRequestInterceptor();
createResponseInterceptor();

export default instance;
