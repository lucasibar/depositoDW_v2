// Placeholders para búsqueda
export const SEARCH_PLACEHOLDERS = {
  STOCK: "Buscar por categoría, descripción, partida o proveedor (ej: nylon 16/1 negro rontaltex)...",
  DEPOSITO: "Buscar por posición, material, categoría o proveedor..."
};

// Mensajes de error
export const ERROR_MESSAGES = {
  LOADING: "Cargando materiales...",
  LOADING_POSICIONES: "Cargando posiciones...",
  RETRY: "Reintentar"
};

// Títulos de resumen
export const SUMMARY_LABELS = {
  TOTAL_KILOS: "Total Kilos:",
  TOTAL_UNIDADES: "Total Unidades:",
  MATERIALES: "Materiales:",
  PARTIDAS: "Partidas:"
};

// Valores por defecto
export const DEFAULT_VALUES = {
  KILOS: 0,
  UNIDADES: 0,
  DECIMAL_PLACES: 2
};

// Filtros avanzados
export const ADVANCED_FILTERS = {
  RACK: {
    MIN: 1,
    MAX: 20,
    LABEL: "Rack"
  },
  FILA: {
    MIN: 1,
    MAX: 14,
    LABEL: "Fila"
  },
  AB: {
    OPTIONS: ["A", "B"],
    LABEL: "A/B"
  },
  PASILLO: {
    MIN: 1,
    MAX: 11,
    LABEL: "Pasillo"
  }
}; 