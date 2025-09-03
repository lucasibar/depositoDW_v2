import { useMemo } from 'react';
import { createItemsFilter, createProveedoresFilter } from '../../../shared/utils/filterUtils';

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
  const filterProveedores = createProveedoresFilter;

  // Función para filtrar items
  const filterItems = createItemsFilter;

  // Validar si el formulario está completo
  const isFormValid = (formData) => {
    // Verificar que proveedor e item estén seleccionados (pueden ser objetos o strings)
    const hasProveedor = formData.proveedor && (
      typeof formData.proveedor === 'object' ? 
        formData.proveedor.id && formData.proveedor.nombre : 
        formData.proveedor.trim() !== ''
    );
    const hasItem = formData.item && (
      typeof formData.item === 'object' ? 
        formData.item.id && formData.item.descripcion : 
        formData.item.trim() !== ''
    );
    const hasPartida = formData.partida && formData.partida.trim() !== '';
    const hasCantidad = (formData.kilos && parseFloat(formData.kilos) > 0) || (formData.unidades && parseInt(formData.unidades) > 0);
    
    // Verificar datos básicos
    const hasBasicData = hasProveedor && hasItem && hasPartida && hasCantidad;
    
    if (!hasBasicData) {
      return false;
    }
    
    // Verificar posición - debe tener O rack/fila/nivel O pasillo, pero no ambos
    const hasRackPosition = formData.rack && formData.rack.trim() !== '' && 
                           formData.fila && formData.fila.trim() !== '' && 
                           formData.nivel && formData.nivel.trim() !== '';
    const hasPasilloPosition = formData.pasillo && formData.pasillo.trim() !== '';
    
    // Debe tener exactamente uno de los dos tipos de posición
    return (hasRackPosition && !hasPasilloPosition) || (hasPasilloPosition && !hasRackPosition);
  };

  return {
    itemsFiltrados,
    filterProveedores,
    filterItems,
    isFormValid
  };
};
