import { useState } from 'react';
import { apiClient } from '../config/api';

export const useRemitosSalida = () => {
  const [remitos, setRemitos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerRemitosSalida = async (fechaDesde, fechaHasta) => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener todos los movimientos individuales
      const response = await apiClient.get('/movimientos/all-individuales');
      const todosMovimientos = response.data || [];
      
      // Filtrar por tipo remitoSalida y fechas
      const movimientosSalida = todosMovimientos.filter(mov => {
        const esRemitoSalida = mov.tipoMovimiento === 'remitoSalida' || 
                               (mov.tipoMovimiento && mov.tipoMovimiento.toLowerCase() === 'remitosalida');
        
        if (!esRemitoSalida) return false;
        
        // Filtrar por fecha si se proporcionan
        if (fechaDesde || fechaHasta) {
          const fechaMov = mov.fecha ? new Date(mov.fecha).toISOString().split('T')[0] : null;
          
          if (fechaDesde && fechaMov && fechaMov < fechaDesde) return false;
          if (fechaHasta && fechaMov && fechaMov > fechaHasta) return false;
        }
        
        return true;
      });
      
      // Agrupar por fecha y proveedor (cliente) - sin depender del numeroRemito
      const remitosAgrupados = {};
      movimientosSalida.forEach(mov => {
        const fecha = mov.fecha ? new Date(mov.fecha).toISOString().split('T')[0] : 'Sin fecha';
        // Usar el proveedor del movimiento (que es el cliente en remitos de salida)
        const proveedorNombre = typeof mov.proveedor === 'string' 
          ? mov.proveedor 
          : (mov.proveedor?.nombre || 'Sin proveedor');
        const proveedorId = mov.proveedor?.id || proveedorNombre;
        const clave = `${fecha}_${proveedorId}`;
        
        if (!remitosAgrupados[clave]) {
          remitosAgrupados[clave] = {
            fecha: fecha,
            proveedor: typeof mov.proveedor === 'object' ? mov.proveedor : { nombre: proveedorNombre },
            proveedorNombre: proveedorNombre,
            items: []
          };
        }
        
        remitosAgrupados[clave].items.push({
          id: mov.id,
          item: mov.item,
          partida: mov.partida,
          kilos: mov.kilos,
          unidades: mov.unidades,
          numeroRemito: mov.numeroRemito
        });
      });
      
      const remitos = Object.values(remitosAgrupados);
      setRemitos(remitos);
      return { ok: true, data: remitos };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener remitos de salida';
      setError(errorMessage);
      console.error('Error al obtener remitos de salida:', err);
      return { ok: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const eliminarRemito = async (movimientoId) => {
    try {
      await apiClient.delete(`/movimientos/movimiento/${movimientoId}`);
      return { ok: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el remito';
      console.error('Error al eliminar remito:', err);
      return { ok: false, error: errorMessage };
    }
  };

  const eliminarItemRemito = async (movimientoId, fechaDesde, fechaHasta) => {
    try {
      const resultado = await eliminarRemito(movimientoId);
      
      // Actualizar la lista de remitos después de eliminar
      if (resultado.ok && fechaDesde && fechaHasta) {
        await obtenerRemitosSalida(fechaDesde, fechaHasta);
      }
      
      return resultado;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el item';
      console.error('Error al eliminar item:', err);
      return { ok: false, error: errorMessage };
    }
  };

  return {
    remitos,
    loading,
    error,
    obtenerRemitosSalida,
    eliminarRemito,
    eliminarItemRemito
  };
};

