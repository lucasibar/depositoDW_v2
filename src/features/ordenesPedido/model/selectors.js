import { createSelector } from '@reduxjs/toolkit';

// Selectores básicos
export const selectOrdenesPedidoState = (state) => state.ordenesPedido;

export const selectOrdenes = (state) => state.ordenesPedido.ordenes;
export const selectOrdenActual = (state) => state.ordenesPedido.ordenActual;
export const selectOrdenACopiar = (state) => state.ordenesPedido.ordenACopiar;
export const selectLoading = (state) => state.ordenesPedido.loading;
export const selectError = (state) => state.ordenesPedido.error;
export const selectFiltros = (state) => state.ordenesPedido.filtros;
export const selectPaginacion = (state) => state.ordenesPedido.paginacion;

// Selectores computados

export const selectOrdenesPorEstado = createSelector(
  [selectOrdenes],
  (ordenes) => {
    if (!ordenes || ordenes.length === 0) return {};

    return ordenes.reduce((acc, orden) => {
      const estado = orden.estado || 'sin_estado';
      if (!acc[estado]) {
        acc[estado] = [];
      }
      acc[estado].push(orden);
      return acc;
    }, {});
  }
);

export const selectEstadisticasOrdenes = createSelector(
  [selectOrdenes],
  (ordenes) => {
    if (!ordenes || ordenes.length === 0) {
      return {
        total: 0,
        pendientes: 0,
        enProceso: 0,
        completadas: 0,
        canceladas: 0,
        totalItems: 0,
        totalValor: 0
      };
    }

    const estadisticas = ordenes.reduce((acc, orden) => {
      acc.total += 1;
      acc.totalItems += orden.items?.length || 0;
      acc.totalValor += orden.valorTotal || 0;

      switch (orden.estado) {
        case 'pendiente':
          acc.pendientes += 1;
          break;
        case 'en_proceso':
          acc.enProceso += 1;
          break;
        case 'completada':
          acc.completadas += 1;
          break;
        case 'cancelada':
          acc.canceladas += 1;
          break;
        default:
          break;
      }

      return acc;
    }, {
      total: 0,
      pendientes: 0,
      enProceso: 0,
      completadas: 0,
      canceladas: 0,
      totalItems: 0,
      totalValor: 0
    });

    return estadisticas;
  }
);

export const selectOrdenesRecientes = createSelector(
  [selectOrdenes],
  (ordenes) => {
    if (!ordenes || ordenes.length === 0) return [];

    return [...ordenes]
      .sort((a, b) => {
        const fechaA = new Date(a.fecha || a.fechaCreacion);
        const fechaB = new Date(b.fecha || b.fechaCreacion);
        
        // Verificar si las fechas son válidas
        if (isNaN(fechaA.getTime()) || isNaN(fechaB.getTime())) return 0;
        
        return fechaB - fechaA;
      })
      .slice(0, 5);
  }
);

export const selectOrdenesConPicking = createSelector(
  [selectOrdenes],
  (ordenes) => {
    if (!ordenes || ordenes.length === 0) return [];

    return ordenes.filter(orden => orden.pickingGenerado === true);
  }
);

export const selectOrdenesSinPicking = createSelector(
  [selectOrdenes],
  (ordenes) => {
    if (!ordenes || ordenes.length === 0) return [];

    return ordenes.filter(orden => !orden.pickingGenerado);
  }
);

export const selectOrdenesPorProveedor = createSelector(
  [selectOrdenes],
  (ordenes) => {
    if (!ordenes || ordenes.length === 0) return {};

    return ordenes.reduce((acc, orden) => {
      const proveedorId = orden.proveedor?.id || 'sin_proveedor';
      const proveedorNombre = orden.proveedor?.nombre || 'Sin Proveedor';
      
      if (!acc[proveedorId]) {
        acc[proveedorId] = {
          id: proveedorId,
          nombre: proveedorNombre,
          ordenes: [],
          totalOrdenes: 0,
          totalValor: 0
        };
      }
      
      acc[proveedorId].ordenes.push(orden);
      acc[proveedorId].totalOrdenes += 1;
      acc[proveedorId].totalValor += orden.valorTotal || 0;
      
      return acc;
    }, {});
  }
);

export const selectOrdenesPorFecha = createSelector(
  [selectOrdenes],
  (ordenes) => {
    if (!ordenes || ordenes.length === 0) return {};

    return ordenes.reduce((acc, orden) => {
      const fechaOrden = new Date(orden.fecha || orden.fechaCreacion);
      
      // Verificar si la fecha es válida
      if (isNaN(fechaOrden.getTime())) return acc;
      
      const fecha = fechaOrden.toISOString().split('T')[0];
      
      if (!acc[fecha]) {
        acc[fecha] = {
          fecha,
          ordenes: [],
          totalOrdenes: 0,
          totalValor: 0
        };
      }
      
      acc[fecha].ordenes.push(orden);
      acc[fecha].totalOrdenes += 1;
      acc[fecha].totalValor += orden.valorTotal || 0;
      
      return acc;
    }, {});
  }
);

// Selector para obtener órdenes paginadas
export const selectOrdenesPaginadas = createSelector(
  [selectOrdenes, selectPaginacion],
  (ordenes, paginacion) => {
    const inicio = (paginacion.pagina - 1) * paginacion.limite;
    const fin = inicio + paginacion.limite;
    
    return {
      ordenes: ordenes.slice(inicio, fin),
      paginacion: {
        ...paginacion,
        total: ordenes.length,
        totalPaginas: Math.ceil(ordenes.length / paginacion.limite)
      }
    };
  }
);

// Selector para verificar si hay órdenes
export const selectTieneOrdenes = createSelector(
  [selectOrdenes],
  (ordenes) => ordenes && ordenes.length > 0
);

// Selector para obtener el estado de carga general
export const selectEstadoCarga = createSelector(
  [selectLoading, selectError, selectOrdenes],
  (loading, error, ordenes) => ({
    loading,
    error,
    tieneDatos: ordenes && ordenes.length > 0,
    vacio: !loading && !error && (!ordenes || ordenes.length === 0)
  })
);

// Selectores adicionales para compatibilidad - obtienen datos del slice de remitos
export const selectProveedores = (state) => {
  return state.remitos?.proveedores || [];
};

export const selectItems = (state) => {
  return state.remitos?.items || [];
};

export const selectOrdenesPedidoLoading = selectLoading;
export const selectOrdenesPedidoError = selectError;
