// api.ts
import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 30000, // Definir o timeout como 30 segundos
});

export default instance;
