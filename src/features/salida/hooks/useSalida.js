import { useMemo } from 'react';

export const useSalida = (proveedores, items, clientes, proveedorSeleccionado, clienteSeleccionado) => {
  // Filtrar items por proveedor seleccionado (el proveedor determina los items disponibles)
  const itemsFiltrados = useMemo(() => {
    // Si no hay proveedor seleccionado, no mostrar items
    if (!proveedorSeleccionado) {
      return [];
    }
    
    // Si no hay items, no mostrar nada
    if (!items || !items.length) {
      return [];
    }
    
    // Filtrar items usando la misma lógica que adición rápida
    const itemsFiltrados = items.filter(item => {
      // Si selectedProveedor es un objeto, comparar por ID
      if (typeof proveedorSeleccionado === 'object' && proveedorSeleccionado !== null) {
        const coincide = item.proveedor?.id === proveedorSeleccionado.id;
        return coincide;
      }
      
      // Si selectedProveedor es un string, comparar por nombre
      const coincide = item.proveedor?.nombre === proveedorSeleccionado;
      return coincide;
    });
    
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
    const validaciones = {
      cliente: !!formData.cliente,
      proveedor: !!formData.proveedor,
      item: !!formData.item,
      partida: !!formData.partida,
      cantidad: !!(formData.kilos || formData.unidades),
      fecha: !!formData.fecha,
      // Posición: debe tener rack+fila+nivel O pasillo, pero no ambos
      posicionRack: !!(formData.rack && formData.fila && formData.nivel),
      posicionPasillo: !!formData.pasillo
    };
    
    // Verificar que tenga posición rack+fila+nivel O pasillo, pero no ambos
    const tienePosicionRack = validaciones.posicionRack;
    const tienePosicionPasillo = validaciones.posicionPasillo;
    const posicionValida = (tienePosicionRack && !tienePosicionPasillo) || (!tienePosicionRack && tienePosicionPasillo);
    
    const esValido = (
      validaciones.cliente &&
      validaciones.proveedor &&
      validaciones.item &&
      validaciones.partida &&
      validaciones.cantidad &&
      validaciones.fecha &&
      posicionValida
    );
    
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
