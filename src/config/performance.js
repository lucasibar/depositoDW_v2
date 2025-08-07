// Configuraciones de optimización de rendimiento

// Configuración para lazy loading
export const LAZY_LOADING_CONFIG = {
  // Tiempo de espera antes de mostrar el loading spinner
  loadingDelay: 200,
  // Tiempo máximo de carga antes de mostrar error
  timeout: 10000,
};

// Configuración para preload
export const PRELOAD_CONFIG = {
  // Páginas que se preloadan al hacer hover
  preloadOnHover: true,
  // Páginas que se preloadan inmediatamente después del login
  preloadAfterLogin: ['deposito', 'compras'],
};

// Configuración para cache
export const CACHE_CONFIG = {
  // Tiempo de vida del cache en segundos
  maxAge: 3600, // 1 hora
  // Tamaño máximo del cache en MB
  maxSize: 50,
};

// Configuración para métricas de rendimiento
export const PERFORMANCE_CONFIG = {
  // Umbrales para métricas de Core Web Vitals
  thresholds: {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
  },
  // Habilitar logging de métricas
  enableLogging: true,
};

// Función para medir el rendimiento de carga de componentes
export const measureComponentLoad = (componentName) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    const duration = end - start;
    console.log(`⏱️ ${componentName} cargado en ${duration.toFixed(2)}ms`);
    
    if (duration > 1000) {
      console.warn(`⚠️ ${componentName} tardó más de 1 segundo en cargar`);
    }
  };
};

// Función para optimizar imágenes
export const optimizeImage = (src, width = 800) => {
  // Si es una imagen externa, agregar parámetros de optimización
  if (src.includes('http')) {
    return `${src}?w=${width}&q=80&auto=format`;
  }
  return src;
};

// Función para debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Función para throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 