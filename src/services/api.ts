// Serviços de API da aplicação
import { invoke } from "@tauri-apps/api/core";
import type { ApiResponse } from "../types";

export class ApiService {
  // Exemplo de chamada para comando Tauri
  static async greet(name: string): Promise<string> {
    return await invoke("greet", { name });
  }

  // Exemplo de wrapper para outras APIs
  static async fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      // Aqui você faria uma requisição HTTP real
      // Para este exemplo, simularemos uma resposta
      const response = await fetch(endpoint);
      const data = await response.json();
      
      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }
}