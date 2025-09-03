/**
 * Utilidades para filtrado de items y proveedores
 */

/**
 * Filtra items basándose en una búsqueda de texto
 * Busca que TODAS las palabras estén presentes en categoría o descripción
 * @param {Array} items - Array de items a filtrar
 * @param {string} searchText - Texto de búsqueda
 * @returns {Array} - Items filtrados
 */
export const filterItemsBySearch = (items, searchText) => {
  if (!searchText || !searchText.trim()) return items;
  
  // Dividir la búsqueda en palabras individuales
  const searchWords = searchText.toLowerCase().trim().split(' ').filter(word => word.length > 0);
  
  // Filtrar items que contengan TODAS las palabras de búsqueda
  return items.filter(item => {
    const itemText = `${item.categoria || ''} ${item.descripcion || ''}`.toLowerCase();
    
    // Verificar que TODAS las palabras estén presentes
    return searchWords.every(word => itemText.includes(word));
  });
};

/**
 * Filtra proveedores basándose en una búsqueda de texto
 * Busca que TODAS las palabras estén presentes en el nombre
 * @param {Array} proveedores - Array de proveedores a filtrar
 * @param {string} searchText - Texto de búsqueda
 * @returns {Array} - Proveedores filtrados
 */
export const filterProveedoresBySearch = (proveedores, searchText) => {
  if (!searchText || !searchText.trim()) return proveedores;
  
  // Dividir la búsqueda en palabras individuales
  const searchWords = searchText.toLowerCase().trim().split(' ').filter(word => word.length > 0);
  
  // Filtrar proveedores que contengan TODAS las palabras de búsqueda
  return proveedores.filter(proveedor => {
    const proveedorText = (proveedor.nombre || '').toLowerCase();
    
    // Verificar que TODAS las palabras estén presentes
    return searchWords.every(word => proveedorText.includes(word));
  });
};

/**
 * Función para usar con Autocomplete de Material-UI
 * Filtra items que contengan TODAS las palabras de búsqueda
 * @param {Array} options - Opciones disponibles
 * @param {Object} params - Parámetros del filtro (incluye inputValue)
 * @returns {Array} - Opciones filtradas
 */
export const createItemsFilter = (options, { inputValue }) => {
  return filterItemsBySearch(options, inputValue);
};

/**
 * Función para usar con Autocomplete de Material-UI
 * Filtra proveedores que contengan TODAS las palabras de búsqueda
 * @param {Array} options - Opciones disponibles
 * @param {Object} params - Parámetros del filtro (incluye inputValue)
 * @returns {Array} - Opciones filtradas
 */
export const createProveedoresFilter = (options, { inputValue }) => {
  return filterProveedoresBySearch(options, inputValue);
};
