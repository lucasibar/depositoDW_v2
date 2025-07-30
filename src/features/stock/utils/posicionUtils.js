/**
 * Genera el título para una posición
 * @param {Object} posicion - Posición con rack, fila, AB, pasillo
 * @returns {string} - Título formateado de la posición
 */
export const generatePosicionTitle = (posicion) => {
  if (posicion.entrada) {
    return 'Posición de Entrada';
  }
  
  if (posicion.pasillo) {
    return `Pasillo ${posicion.pasillo}`;
  }
  
  if (posicion.rack && posicion.fila && posicion.AB) {
    return `Rack ${posicion.rack} - Fila ${posicion.fila} - ${posicion.AB}`;
  }
  
  return 'Posición sin información';
};

/**
 * Filtra posiciones por múltiples palabras de búsqueda
 * @param {Array} posiciones - Lista de posiciones a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} - Posiciones filtradas
 */
export const filterPosicionesBySearch = (posiciones, searchTerm) => {
  if (!searchTerm.trim()) {
    return posiciones;
  }

  const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
  
  return posiciones.filter(posicion => {
    // Crear un string con todos los campos de búsqueda
    const searchableText = [
      generatePosicionTitle(posicion),
      ...posicion.items?.map(item => [
        item.categoria || '',
        item.descripcion || '',
        item.partida || '',
        item.proveedor?.nombre || ''
      ].join(' ')) || []
    ].join(' ').toLowerCase();
    
    // Verificar si TODAS las palabras están presentes en el texto buscable
    return searchWords.every(word => searchableText.includes(word));
  });
};

/**
 * Filtra posiciones por filtros avanzados (rack, fila, AB, pasillo)
 * @param {Array} posiciones - Lista de posiciones a filtrar
 * @param {Object} filters - Objeto con filtros {rack, fila, ab, pasillo}
 * @returns {Array} - Posiciones filtradas
 */
export const filterPosicionesByAdvancedFilters = (posiciones, filters) => {
  return posiciones.filter(posicion => {
    // Filtrar por rack
    if (filters.rack && posicion.rack !== parseInt(filters.rack)) {
      return false;
    }
    
    // Filtrar por fila
    if (filters.fila && posicion.fila !== parseInt(filters.fila)) {
      return false;
    }
    
    // Filtrar por AB
    if (filters.ab && posicion.AB !== filters.ab) {
      return false;
    }
    
    // Filtrar por pasillo
    if (filters.pasillo && posicion.pasillo !== parseInt(filters.pasillo)) {
      return false;
    }
    
    return true;
  });
};

/**
 * Calcula el total de kilos de una posición
 * @param {Object} posicion - Posición con items
 * @returns {number} - Total de kilos
 */
export const calculatePosicionTotalKilos = (posicion) => {
  return posicion.items?.reduce((sum, item) => sum + (item.kilos || 0), 0) || 0;
};

/**
 * Calcula el total de unidades de una posición
 * @param {Object} posicion - Posición con items
 * @returns {number} - Total de unidades
 */
export const calculatePosicionTotalUnidades = (posicion) => {
  return posicion.items?.reduce((sum, item) => sum + (item.unidades || 0), 0) || 0;
};

/**
 * Aplica todos los filtros a las posiciones (búsqueda + filtros avanzados)
 * @param {Array} posiciones - Lista de posiciones a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @param {Object} advancedFilters - Filtros avanzados {rack, fila, ab, pasillo}
 * @returns {Array} - Posiciones filtradas
 */
export const applyAllFilters = (posiciones, searchTerm, advancedFilters) => {
  let filtered = posiciones;
  
  // Aplicar filtro de búsqueda
  if (searchTerm.trim()) {
    filtered = filterPosicionesBySearch(filtered, searchTerm);
  }
  
  // Aplicar filtros avanzados
  if (Object.values(advancedFilters).some(filter => filter !== '')) {
    filtered = filterPosicionesByAdvancedFilters(filtered, advancedFilters);
  }
  
  return filtered;
}; 