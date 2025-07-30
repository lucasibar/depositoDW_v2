/**
 * Filtra materiales por múltiples palabras de búsqueda
 * @param {Array} materials - Lista de materiales a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} - Materiales filtrados
 */
export const filterMaterialsBySearch = (materials, searchTerm) => {
  if (!searchTerm.trim()) {
    return materials;
  }

  const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
  
  return materials.filter(material => {
    const searchableText = [
      material?.item?.descripcion || '',
      material?.item?.categoria || '',
      material?.partida?.numeroPartida || '',
      material?.proveedor || ''
    ].join(' ').toLowerCase();
    
    return searchWords.every(word => searchableText.includes(word));
  });
};

/**
 * Genera el título para un material
 * @param {Object} material - Material con item.categoria e item.descripcion
 * @returns {string} - Título formateado
 */
export const generateMaterialTitle = (material) => {
  const categoria = material.item?.categoria || '';
  const descripcion = material.item?.descripcion || '';
  
  if (categoria && descripcion) {
    return `${categoria} - ${descripcion}`;
  } else if (descripcion) {
    return descripcion;
  } else if (categoria) {
    return categoria;
  } else {
    return 'Material sin información';
  }
}; 