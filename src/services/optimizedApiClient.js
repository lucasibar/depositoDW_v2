import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { cacheService } from './cacheService';

// Cliente API optimizado para móviles
class OptimizedApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
      maxContentLength: 10 * 1024 * 1024,
      maxBodyLength: 10 * 1024 * 1024,
    });

    this.setupInterceptors();
  }

  // Configurar interceptores para manejo de errores y caché
  setupInterceptors() {
    // Interceptor de respuesta para caché
    this.client.interceptors.response.use(
      (response) => {
        // Cachear respuestas GET exitosas
        if (response.config.method === 'get' && response.data) {
          const cacheKey = this.generateCacheKey(response.config.url, response.config.params);
          cacheService.set(cacheKey, response.data, API_CONFIG.CACHE_CONFIG.defaultTTL);
        }
        return response;
      },
      (error) => {
        // Si es un error de red o CORS, intentar usar caché para GET
        if (error.code === 'NETWORK_ERROR' || 
            error.code === 'ECONNABORTED' || 
            error.message.includes('CORS') ||
            error.response?.status === 0) {
          if (error.config.method === 'get') {
            const cacheKey = this.generateCacheKey(error.config.url, error.config.params);
            const cachedData = cacheService.get(cacheKey);
            if (cachedData) {
              console.log('Usando datos en caché debido a error de red/CORS');
              return Promise.resolve({
                data: cachedData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: error.config,
                fromCache: true
              });
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Generar clave de caché
  generateCacheKey(url, params = {}) {
    return cacheService.generateKey(url, params);
  }

  // GET optimizado con caché
  async get(url, params = {}, useCache = true) {
    const cacheKey = this.generateCacheKey(url, params);
    
    // Intentar obtener del caché primero
    if (useCache) {
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        console.log('Datos obtenidos del caché:', url);
        return { data: cachedData, fromCache: true };
      }
    }

    try {
      const response = await this.client.get(url, { params });
      return response;
    } catch (error) {
      console.error('Error en GET request:', error);
      throw error;
    }
  }

  // POST optimizado
  async post(url, data = {}) {
    try {
      const response = await this.client.post(url, data);
      
      // Invalidar caché relacionado después de POST
      this.invalidateRelatedCache(url);
      
      return response;
    } catch (error) {
      console.error('Error en POST request:', error);
      throw error;
    }
  }

  // PUT optimizado
  async put(url, data = {}) {
    try {
      const response = await this.client.put(url, data);
      
      // Invalidar caché relacionado después de PUT
      this.invalidateRelatedCache(url);
      
      return response;
    } catch (error) {
      console.error('Error en PUT request:', error);
      throw error;
    }
  }

  // DELETE optimizado
  async delete(url) {
    try {
      const response = await this.client.delete(url);
      
      // Invalidar caché relacionado después de DELETE
      this.invalidateRelatedCache(url);
      
      return response;
    } catch (error) {
      console.error('Error en DELETE request:', error);
      throw error;
    }
  }

  // Invalidar caché relacionado
  invalidateRelatedCache(url) {
    // Limpiar caché de stock cuando se modifican datos
    if (url.includes('/movimientos') || url.includes('/stock') || url.includes('/posiciones')) {
      const keysToDelete = [];
      
      // Buscar claves de caché relacionadas
      for (const key of cacheService.cache.keys()) {
        if (key.includes('/stock') || key.includes('/movimientos') || key.includes('/posiciones')) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => cacheService.delete(key));
      console.log('Caché invalidado para:', url);
    }
  }

  // Verificar conectividad
  async checkConnectivity() {
    try {
      const response = await this.client.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Obtener estadísticas de rendimiento
  getPerformanceStats() {
    return {
      cache: cacheService.getStats(),
      connectivity: navigator.onLine
    };
  }
}

// Exportar instancia singleton
export const optimizedApiClient = new OptimizedApiClient();
