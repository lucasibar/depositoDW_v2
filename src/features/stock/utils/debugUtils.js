// Utilidades de debug para operaciones de stock
export const debugStockOperations = {
  // Debug para movimiento interno
  logMovimientoInterno: (data) => {
    console.group('🔍 DEBUG: Movimiento Interno');
    console.log('Datos enviados:', data);
    console.log('selectedItem:', data.selectedItem);
    console.log('data:', data.data);
    console.log('id:', data.id);
    console.groupEnd();
  },

  // Debug para ajuste de stock
  logAjusteStock: (data) => {
    console.group('🔍 DEBUG: Ajuste Stock');
    console.log('Datos enviados:', data);
    console.log('proveedor:', data.proveedor);
    console.log('item:', data.item);
    console.log('kilos:', data.kilos);
    console.log('unidades:', data.unidades);
    console.log('partida:', data.partida);
    console.log('posicion:', data.posicion);
    console.groupEnd();
  },

  // Debug para adición rápida
  logAdicionRapida: (data) => {
    console.group('🔍 DEBUG: Adición Rápida');
    console.log('Datos enviados:', data);
    console.log('posicionId:', data.posicionId);
    console.log('item:', data.item);
    console.groupEnd();
  },

  // Validar estructura de datos para movimiento interno
  validateMovimientoInternoData: (data) => {
    const errors = [];
    
    if (!data.selectedItem) {
      errors.push('selectedItem es requerido');
    } else {
      if (!data.selectedItem.itemId) errors.push('selectedItem.itemId es requerido');
      if (!data.selectedItem.categoria) errors.push('selectedItem.categoria es requerido');
      if (!data.selectedItem.descripcion) errors.push('selectedItem.descripcion es requerido');
      if (!data.selectedItem.proveedor) errors.push('selectedItem.proveedor es requerido');
      if (!data.selectedItem.partida) errors.push('selectedItem.partida es requerido');
      if (!data.selectedItem.kilos) errors.push('selectedItem.kilos es requerido');
      if (!data.selectedItem.unidades) errors.push('selectedItem.unidades es requerido');
    }
    
    if (!data.data) {
      errors.push('data es requerido');
    } else {
      const hasLocation = data.data.pasillo !== undefined || 
                         (data.data.rack !== undefined && data.data.fila !== undefined && data.data.nivel !== undefined);
      if (!hasLocation) {
        errors.push('Debe especificar pasillo O (rack, fila, nivel)');
      }
    }
    
    if (!data.id) {
      errors.push('id es requerido');
    }
    
    return errors;
  },

  // Validar estructura de datos para ajuste de stock
  validateAjusteStockData: (data) => {
    const errors = [];
    
    if (!data.proveedor) errors.push('proveedor es requerido');
    if (!data.item) errors.push('item es requerido');
    if (!data.item.itemId) errors.push('item.itemId es requerido');
    if (!data.item.categoria) errors.push('item.categoria es requerido');
    if (!data.item.descripcion) errors.push('item.descripcion es requerido');
    if (!data.item.proveedor) errors.push('item.proveedor es requerido');
    if (!data.item.partida) errors.push('item.partida es requerido');
    if (!data.kilos) errors.push('kilos es requerido');
    if (!data.unidades) errors.push('unidades es requerido');
    if (!data.partida) errors.push('partida es requerido');
    if (!data.posicion) errors.push('posicion es requerido');
    
    return errors;
  },

  // Validar estructura de datos para adición rápida
  validateAdicionRapidaData: (data) => {
    const errors = [];
    
    if (!data.posicionId) errors.push('posicionId es requerido');
    if (!data.item) errors.push('item es requerido');
    if (!data.item.id) errors.push('item.id es requerido');
    if (!data.item.categoria) errors.push('item.categoria es requerido');
    if (!data.item.descripcion) errors.push('item.descripcion es requerido');
    if (!data.item.proveedor) errors.push('item.proveedor es requerido');
    if (!data.item.partida) errors.push('item.partida es requerido');
    if (!data.item.kilos) errors.push('item.kilos es requerido');
    if (!data.item.unidades) errors.push('item.unidades es requerido');
    
    return errors;
  }
};
