import { useMemo } from 'react';

export const useSalida = (proveedores, items, clientes, proveedorSeleccionado, clienteSeleccionado) => {
  // Filtrar items por proveedor seleccionado (el proveedor determina los items disponibles)
  const itemsFiltrados = useMemo(() => {
    console.log('=== FILTRANDO ITEMS ===');
    console.log('proveedorSeleccionado:', proveedorSeleccionado);
    console.log('proveedorSeleccionado.id:', proveedorSeleccionado?.id);
    console.log('proveedorSeleccionado.nombre:', proveedorSeleccionado?.nombre);
    console.log('items disponibles:', items);
    console.log('items.length:', items.length);
    
    if (!proveedorSeleccionado) {
      console.log('❌ No hay proveedor seleccionado');
      return [];
    }
    
    if (!items.length) {
      console.log('❌ No hay items disponibles');
      return [];
    }
    
    const proveedorId = proveedorSeleccionado.id || proveedorSeleccionado;
    console.log('🔍 Proveedor ID para filtrar:', proveedorId);
    console.log('🔍 Tipo de proveedorId:', typeof proveedorId);
    
    const itemsFiltrados = items.filter(item => {
      console.log(`\n--- Analizando item: ${item.descripcion} ---`);
      console.log('item.proveedorId:', item.proveedorId);
      console.log('Tipo de item.proveedorId:', typeof item.proveedorId);
      
      // Si el item tiene un proveedorId, filtrar por ese
      if (item.proveedorId !== undefined && item.proveedorId !== null) {
        const coincide = item.proveedorId === proveedorId;
        console.log(`✅ Item ${item.descripcion} - proveedorId: ${item.proveedorId}, coincide: ${coincide}`);
        return coincide;
      }
      
      // Si no tiene proveedorId, mostrar todos los items
      console.log(`⚠️ Item ${item.descripcion} - sin proveedorId, incluyendo`);
      return true;
    });
    
    console.log('\n=== RESULTADO FILTRADO ===');
    console.log('Items filtrados resultantes:', itemsFiltrados);
    console.log('Cantidad de items filtrados:', itemsFiltrados.length);
    return itemsFiltrados;
  }, [items, proveedorSeleccionado]);

  // Función para filtrar proveedores en el autocomplete
  const filterProveedores = (options, { inputValue }) => {
    if (!inputValue) return options;
    
    return options.filter(option => 
      option.nombre && 
      option.nombre.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Función para filtrar clientes en el autocomplete
  const filterClientes = (options, { inputValue }) => {
    if (!inputValue) return options;
    
    return options.filter(option => 
      option.nombre && 
      option.nombre.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  // Función para filtrar items en el autocomplete
  const filterItems = (options, { inputValue }) => {
    if (!inputValue) return options;
    
    return options.filter(option => {
      const descripcion = option.descripcion || '';
      const categoria = option.categoria || '';
      const searchText = inputValue.toLowerCase();
      
      return descripcion.toLowerCase().includes(searchText) ||
             categoria.toLowerCase().includes(searchText);
    });
  };

  // Validación del formulario
  const isFormValid = (formData) => {
    console.log('Validando formulario:', formData);
    
    const validaciones = {
      cliente: !!formData.cliente,
      proveedor: !!formData.proveedor,
      item: !!formData.item,
      partida: !!formData.partida,
      cantidad: !!(formData.kilos || formData.unidades),
      // Posición: debe tener rack+fila+nivel O pasillo, pero no ambos
      posicionRack: !!(formData.rack && formData.fila && formData.nivel),
      posicionPasillo: !!formData.pasillo
    };
    
    console.log('Validaciones:', validaciones);
    
    // Verificar que tenga posición rack+fila+nivel O pasillo, pero no ambos
    const tienePosicionRack = validaciones.posicionRack;
    const tienePosicionPasillo = validaciones.posicionPasillo;
    const posicionValida = (tienePosicionRack && !tienePosicionPasillo) || (!tienePosicionRack && tienePosicionPasillo);
    
    console.log('Posición rack+fila+nivel:', tienePosicionRack);
    console.log('Posición pasillo:', tienePosicionPasillo);
    console.log('Posición válida (mutuamente excluyente):', posicionValida);
    
    const esValido = (
      validaciones.cliente &&
      validaciones.proveedor &&
      validaciones.item &&
      validaciones.partida &&
      validaciones.cantidad &&
      posicionValida
    );
    
    console.log('Formulario válido:', esValido);
    return esValido;
  };

  return {
    itemsFiltrados,
    filterProveedores,
    filterClientes,
    filterItems,
    isFormValid
  };
};
