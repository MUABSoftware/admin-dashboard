import axios, { AxiosInstance, 
  // AxiosResponse 
} from 'axios';

const request: AxiosInstance = axios.create({
  baseURL: 'https://api-dev.muab.info/api/admin',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default request; 