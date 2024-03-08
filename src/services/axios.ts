// api.ts
import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://api-servicos-automacao.bairru.com.br/",
  timeout: 30000, // Definir o timeout como 30 segundos
  
});

export default instance;
