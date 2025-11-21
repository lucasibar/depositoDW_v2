/**
 * Genera el título para una posición
 * @param {Object} posicion - Posición con rack, fila, AB, pasillo
 * @returns {string} - Título formateado de la posición
 */
export const generatePosicionTitle = (posicion) => {
  if (!posicion) {
    return 'Posición no disponible';
  }
  
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
    // Si la posición no tiene items, verificar si el término de búsqueda coincide con el título de la posición
    if (!posicion.items || posicion.items.length === 0) {
      const posicionTitle = generatePosicionTitle(posicion).toLowerCase();
      return searchWords.every(word => posicionTitle.includes(word));
    }

    // Verificar si al menos un item coincide con la búsqueda
    return posicion.items.some(item => {
      const searchableText = [
        item.categoria || '',
        item.descripcion || '',
        item.partida || '',
        item.proveedor?.nombre || ''
      ].join(' ').toLowerCase();
      
      // Verificar si TODAS las palabras están presentes en el texto del item
      return searchWords.every(word => searchableText.includes(word));
    });
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
  
  // Ordenar las posiciones según el criterio especificado
  return sortPosiciones(filtered);
};

/**
 * Ordena las posiciones según el criterio especificado:
 * 1. Posiciones con entrada=true primero
 * 2. Posiciones con rack y fila ordenadas por rack, luego por fila
 * 3. Posiciones de pasillo al final
 * @param {Array} posiciones - Lista de posiciones a ordenar
 * @returns {Array} - Posiciones ordenadas
 */
export const sortPosiciones = (posiciones) => {
  return [...posiciones].sort((a, b) => {
    // 1. Posiciones con entrada=true van primero
    if (a.entrada && !b.entrada) return -1;
    if (!a.entrada && b.entrada) return 1;
    
    // 2. Si ambas tienen entrada=true, mantener el orden original
    if (a.entrada && b.entrada) {
      return 0;
    }
    
    // 3. Posiciones con rack y fila van antes que las de pasillo
    const aHasRack = a.rack && a.fila;
    const bHasRack = b.rack && b.fila;
    
    if (aHasRack && !bHasRack) return -1;
    if (!aHasRack && bHasRack) return 1;
    
    // 4. Si ambas tienen rack y fila, ordenar por rack, luego por fila
    if (aHasRack && bHasRack) {
      if (a.rack !== b.rack) {
        return a.rack - b.rack;
      }
      return a.fila - b.fila;
    }
    
    // 5. Si ambas son pasillos, ordenar por número de pasillo
    if (a.pasillo && b.pasillo) {
      return a.pasillo - b.pasillo;
    }
    
    // 6. Si una es pasillo y la otra no, la que no es pasillo va primero
    if (a.pasillo && !b.pasillo) return 1;
    if (!a.pasillo && b.pasillo) return -1;
    
    // 7. Si ninguna tiene rack ni pasillo, mantener el orden original
    return 0;
  });
}; 