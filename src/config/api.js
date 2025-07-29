// Configuración de la API
export const API_CONFIG = {
  // URL base del servidor de producción
  BASE_URL: process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com',
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 30000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Configuración de axios
export const axiosConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
}; 