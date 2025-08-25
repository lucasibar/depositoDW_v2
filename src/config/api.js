import axios from 'axios';

// Configuración de la API optimizada para móviles
export const API_CONFIG = {
  // URL base del servidor de producción
  BASE_URL: process.env.REACT_APP_API_URL || 'https://derwill-deposito-backend.onrender.com',
  
  // Sin timeout para conexiones lentas
  TIMEOUT: 0,
  
  // Headers optimizados (sin headers problemáticos de CORS)
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Configuración de reintentos
  RETRY_CONFIG: {
    retries: 2,
    retryDelay: 1000,
    retryCondition: (error) => {
      return error.code === 'ECONNABORTED' || 
             error.response?.status >= 500 || 
             error.message.includes('timeout');
    }
  },
  
  // Configuración de caché
  CACHE_CONFIG: {
    // Tiempo de caché en milisegundos (5 minutos)
    defaultTTL: 5 * 60 * 1000,
    // Tamaño máximo del caché (50 MB)
    maxSize: 50 * 1024 * 1024,
  }
};

// Log para debugging
console.log('🔧 API_CONFIG:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  BASE_URL: API_CONFIG.BASE_URL
});

// Configuración de axios optimizada
export const axiosConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  // Configuración para mejorar rendimiento en móviles
  maxContentLength: 10 * 1024 * 1024, // 10MB máximo
  maxBodyLength: 10 * 1024 * 1024, // 10MB máximo
};

// Cliente axios simple
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  maxContentLength: 10 * 1024 * 1024,
  maxBodyLength: 10 * 1024 * 1024,
}); 