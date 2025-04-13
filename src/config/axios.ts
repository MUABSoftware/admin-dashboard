import axios from "axios";
import { env } from "./env";

const request = axios.create({
  baseURL: env.dev.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    } else if (error.response && error.response.status === 500) {
      alert("An error occurred, please try again later.");
    }
    return Promise.reject(error);
  }
);

export default request;
