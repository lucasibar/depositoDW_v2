// Configuración de rendimiento para dispositivos móviles
export const PERFORMANCE_CONFIG = {
  CACHE: {
    TTL: {
      STOCK_DATA: 5 * 60 * 1000, // 5 minutos
      POSITIONS_DATA: 10 * 60 * 1000, // 10 minutos
      USER_DATA: 15 * 60 * 1000, // 15 minutos
    },
    MAX_SIZE: 50 * 1024 * 1024, // 50 MB
    CLEANUP_PERCENTAGE: 0.2, // 20% de limpieza cuando está lleno
  },
  
  NETWORK: {
    SYNC_INTERVAL: 120000, // 2 minutos
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    CONNECTIVITY_TIMEOUT: 5000,
  },
  
  LAZY_LOADING: {
    MIN_FETCH_INTERVAL: 5 * 60 * 1000, // 5 minutos
    ITEMS_PER_PAGE: 50,
    SEARCH_DEBOUNCE: 300, // 300ms
  },
  
  COMPRESSION: {
    ENABLED: true,
    ALGORITHM: 'gzip',
    LEVEL: 6,
  },
  
  MONITORING: {
    ENABLED: true,
    STATS_UPDATE_INTERVAL: 10000, // 10 segundos
    LOGS_ENABLED: true,
  },
  
  MOBILE: {
    REDUCE_ANIMATIONS: true,
    OPTIMIZE_FOR_SMALL_SCREENS: true,
    TOUCH_OPTIMIZATION: true,
  },
  
  MEMORY: {
    CACHE_MEMORY_LIMIT: 100 * 1024 * 1024, // 100 MB
    DATA_MEMORY_LIMIT: 200 * 1024 * 1024, // 200 MB
    CLEANUP_INTERVAL: 60 * 1000, // 1 minuto
  },
};

// Función para obtener configuración adaptada al dispositivo
export const getDeviceConfig = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSlowConnection = navigator.connection && (
    navigator.connection.effectiveType === 'slow-2g' || 
    navigator.connection.effectiveType === '2g' || 
    navigator.connection.effectiveType === '3g'
  );
  
  return {
    ...PERFORMANCE_CONFIG,
    MOBILE: {
      ...PERFORMANCE_CONFIG.MOBILE,
      IS_MOBILE: isMobile,
      IS_SLOW_CONNECTION: isSlowConnection,
      CACHE: {
        ...PERFORMANCE_CONFIG.CACHE,
        TTL: {
          ...PERFORMANCE_CONFIG.CACHE.TTL,
          // Tiempos más largos para conexiones lentas
          STOCK_DATA: isSlowConnection ? 15 * 60 * 1000 : PERFORMANCE_CONFIG.CACHE.TTL.STOCK_DATA,
          POSITIONS_DATA: isSlowConnection ? 20 * 60 * 1000 : PERFORMANCE_CONFIG.CACHE.TTL.POSITIONS_DATA,
        }
      },
      NETWORK: {
        ...PERFORMANCE_CONFIG.NETWORK,
        // Sincronización menos frecuente para conexiones lentas
        SYNC_INTERVAL: isSlowConnection ? 300000 : PERFORMANCE_CONFIG.NETWORK.SYNC_INTERVAL, // 5 minutos
      }
    }
  };
};

// Función para verificar si el dispositivo es móvil
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Función para verificar la calidad de la conexión
export const getConnectionQuality = () => {
  if (!navigator.connection) return 'unknown';
  
  const { effectiveType, downlink } = navigator.connection;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'poor';
  if (effectiveType === '3g' || downlink < 1) return 'fair';
  if (effectiveType === '4g' && downlink >= 1) return 'good';
  return 'excellent';
};

// Función para obtener configuración optimizada según la conexión
export const getOptimizedConfig = () => {
  const connectionQuality = getConnectionQuality();
  const isMobile = isMobileDevice();
  
  const config = getDeviceConfig();
  
  // Ajustar configuración según la calidad de conexión
  switch (connectionQuality) {
    case 'poor':
      config.CACHE.TTL.STOCK_DATA = 20 * 60 * 1000; // 20 minutos
      config.CACHE.TTL.POSITIONS_DATA = 30 * 60 * 1000; // 30 minutos
      config.NETWORK.SYNC_INTERVAL = 300000; // 5 minutos
      config.LAZY_LOADING.ITEMS_PER_PAGE = 25;
      break;
    case 'fair':
      config.CACHE.TTL.STOCK_DATA = 10 * 60 * 1000; // 10 minutos
      config.CACHE.TTL.POSITIONS_DATA = 15 * 60 * 1000; // 15 minutos
      config.NETWORK.SYNC_INTERVAL = 180000; // 3 minutos
      config.LAZY_LOADING.ITEMS_PER_PAGE = 35;
      break;
    case 'good':
    case 'excellent':
      // Usar configuración por defecto
      break;
  }
  
  return config;
};
