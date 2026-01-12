
import axios, { AxiosResponse, AxiosError } from 'axios';

const getApiBaseUrl = (): string => {
  // 1. Variable de entorno (producción/desarrollo)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 2. Fallback para desarrollo local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:10000/api';
  }

  // 3. Error si no está configurado en producción
  throw new Error('VITE_API_BASE_URL no está configurada. Por favor, configura esta variable de entorno.');
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Importante para cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - logging en desarrollo
api.interceptors.request.use(
  (config) => {
    // El token se envía automáticamente en httpOnly cookie gracias a withCredentials: true
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - maneja errores de autenticación
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data || error.message,
      url: error.config?.url
    });

    // Si hay error 401, limpiar datos de usuario (token se limpia en servidor)
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      // Disparar evento para que AuthContext se actualice
      window.dispatchEvent(new Event('unauthorized'));
    }

    // Si es error de conexión, mostrar mensaje útil
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('No se puede conectar con la API. Verifica que esté corriendo en localhost:10000');
    }

    return Promise.reject(error);
  }
);

// Función para testear conectividad
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return true;
  } catch (error) {
    console.error('API Connection failed:', (error as Error).message);
    return false;
  }
};

export default api;