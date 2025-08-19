// Servicio de caché para optimizar rendimiento en móviles
class CacheService {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50 * 1024 * 1024; // 50MB
    this.currentSize = 0;
    this.cleanupInterval = null;
    this.startCleanupInterval();
  }

  // Generar clave única para el caché
  generateKey(url, params = {}) {
    const paramString = JSON.stringify(params);
    return `${url}:${paramString}`;
  }

  // Calcular tamaño aproximado de un objeto
  calculateSize(obj) {
    return new Blob([JSON.stringify(obj)]).size;
  }

  // Agregar item al caché
  set(key, data, ttl = 5 * 60 * 1000) { // 5 minutos por defecto
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
      size: this.calculateSize(data)
    };

    // Verificar si hay espacio suficiente
    if (this.currentSize + item.size > this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, item);
    this.currentSize += item.size;

    // Guardar en localStorage para persistencia
    try {
      const cacheData = {
        data,
        timestamp: item.timestamp,
        ttl,
        size: item.size
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error guardando en localStorage:', error);
    }
  }

  // Obtener item del caché
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      // Intentar cargar desde localStorage
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const now = Date.now();
          
          if (now - parsed.timestamp < parsed.ttl) {
            this.set(key, parsed.data, parsed.ttl);
            return parsed.data;
          } else {
            localStorage.removeItem(`cache_${key}`);
          }
        }
      } catch (error) {
        console.warn('Error cargando desde localStorage:', error);
      }
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  // Eliminar item del caché
  delete(key) {
    const item = this.cache.get(key);
    if (item) {
      this.currentSize -= item.size;
      this.cache.delete(key);
    }
    
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Error eliminando de localStorage:', error);
    }
  }

  // Limpiar caché expirado
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
  }

  // Evacuar items más antiguos cuando no hay espacio
  evictOldest() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Eliminar el 20% más antiguo
    const toDelete = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toDelete; i++) {
      this.delete(entries[i][0]);
    }
  }

  // Iniciar intervalo de limpieza
  startCleanupInterval() {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000); // Limpiar cada minuto
  }

  // Detener intervalo de limpieza
  stopCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Limpiar todo el caché
  clear() {
    this.cache.clear();
    this.currentSize = 0;
    
    // Limpiar localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error limpiando localStorage:', error);
    }
  }

  // Obtener estadísticas del caché
  getStats() {
    return {
      size: this.cache.size,
      memoryUsage: this.currentSize,
      maxSize: this.maxSize
    };
  }
}

// Exportar instancia singleton
export const cacheService = new CacheService();
