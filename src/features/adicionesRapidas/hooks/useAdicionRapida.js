import { useMemo } from 'react';

export const useAdicionRapida = (proveedores, items, selectedProveedor) => {
  // Filtrar items por proveedor seleccionado
  const itemsFiltrados = useMemo(() => {
    if (!selectedProveedor) return [];
    
    return items.filter(item => {
      return item.proveedor?.nombre === selectedProveedor;
    });
  }, [items, selectedProveedor]);

  // Función para filtrar proveedores
  const filterProveedores = (options, { inputValue }) => {
    const searchTerms = inputValue.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return options.filter(proveedor => {
      const proveedorText = proveedor.nombre?.toLowerCase() || '';
      return searchTerms.every(term => proveedorText.includes(term));
    });
  };

  // Función para filtrar items
  const filterItems = (options, { inputValue }) => {
    const searchTerms = inputValue.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return options.filter(item => {
      // Buscar en categoría y descripción
      const categoriaText = item.categoria?.toLowerCase() || '';
      const descripcionText = item.descripcion?.toLowerCase() || '';
      const itemText = `${categoriaText} ${descripcionText}`;
      
      return searchTerms.every(term => itemText.includes(term));
    });
  };

  // Validar si el formulario está completo
  const isFormValid = (formData) => {
    const hasBasicData = formData.proveedor && 
                        formData.item && 
                        formData.partida && 
                        (formData.kilos || formData.unidades);
    
    // Debe tener posición de rack (rack, fila, nivel) O posición de pasillo
    const hasRackPosition = formData.rack && formData.fila && formData.nivel;
    const hasPasilloPosition = formData.pasillo && formData.pasillo.trim() !== '';
    
    return hasBasicData && (hasRackPosition || hasPasilloPosition);
  };

  return {
    itemsFiltrados,
    filterProveedores,
    filterItems,
    isFormValid
  };
};
