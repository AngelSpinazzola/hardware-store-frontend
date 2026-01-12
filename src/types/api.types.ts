// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  data: T;
  success?: boolean;
  message?: string;
}

// Tipos para errores de API
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Configuración de Axios
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}