/**
 * Calcula el total de kilos de una lista de materiales
 * @param {Array} materials - Lista de materiales
 * @returns {number} - Total de kilos
 */
export const calculateTotalKilos = (materials) => {
  if (!materials || !Array.isArray(materials)) {
    return 0;
  }
  return materials.reduce((sum, material) => sum + (material.kilos || 0), 0);
};

/**
 * Calcula el total de unidades de una lista de materiales
 * @param {Array} materials - Lista de materiales
 * @returns {number} - Total de unidades
 */
export const calculateTotalUnidades = (materials) => {
  if (!materials || !Array.isArray(materials)) {
    return 0;
  }
  return materials.reduce((sum, material) => sum + (material.unidades || 0), 0);
};

/**
 * Cuenta materiales únicos por item (sin importar partidas)
 * @param {Array} materials - Lista de materiales
 * @returns {number} - Cantidad de materiales únicos
 */
export const countUniqueMaterials = (materials) => {
  if (!materials || !Array.isArray(materials)) {
    return 0;
  }
  const uniqueMaterials = new Set();
  materials.forEach(material => {
    if (material.item?.id) {
      uniqueMaterials.add(material.item.id);
    }
  });
  return uniqueMaterials.size;
}; 