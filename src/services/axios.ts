// api.ts
import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://api-servicos-automacao.bairru.com.br/",
  // baseURL: "http://127.0.0.1:5000/",
  timeout: 30000, 
  
});

export default instance;
