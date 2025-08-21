import { useMemo } from 'react';

export const useAdicionRapida = (proveedores, items, selectedProveedor) => {
  // Filtrar items por proveedor seleccionado
  const itemsFiltrados = useMemo(() => {
    if (!selectedProveedor) return [];
    
    return items.filter(item => {
      // Si selectedProveedor es un objeto, comparar por ID
      if (typeof selectedProveedor === 'object' && selectedProveedor !== null) {
        return item.proveedor?.id === selectedProveedor.id;
      }
      
      // Si selectedProveedor es un string, comparar por nombre
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
    // Verificar que proveedor e item estén seleccionados (pueden ser objetos o strings)
    const hasProveedor = formData.proveedor && (typeof formData.proveedor === 'object' ? formData.proveedor.id : formData.proveedor);
    const hasItem = formData.item && (typeof formData.item === 'object' ? formData.item.id : formData.item);
    const hasPartida = formData.partida && formData.partida.trim() !== '';
    const hasCantidad = (formData.kilos && formData.kilos > 0) || (formData.unidades && formData.unidades > 0);
    
    const hasBasicData = hasProveedor && hasItem && hasPartida && hasCantidad;
    
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
