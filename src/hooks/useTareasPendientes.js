import { useState, useEffect } from 'react';
import { apiClient } from '../config/api';

export const useTareasPendientes = () => {
  const [tareas, setTareas] = useState({
    posicionesParaChequear: [],
    movimientosPendientes: [],
    estadisticas: {
      totalPosicionesChequeo: 0,
      posicionesUrgentes: 0,
      movimientosPendientes: 0,
      movimientosUrgentes: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerTareasPendientes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener posiciones que necesitan chequeo
      const posicionesResponse = await apiClient.get('/posiciones/map');
      const posiciones = posicionesResponse.data.posiciones || [];
      
      // Filtrar posiciones que necesitan chequeo (sin chequeo o chequeo antiguo)
      const ahora = new Date();
      const posicionesParaChequear = posiciones.filter(posicion => {
        if (!posicion.ultimo_chequeo) return true; // Sin chequeo
        
        const fechaChequeo = new Date(posicion.ultimo_chequeo);
        const diasTranscurridos = Math.floor((ahora - fechaChequeo) / (1000 * 60 * 60 * 24));
        
        return diasTranscurridos > 7; // Más de 7 días sin chequeo
      });

      // Obtener movimientos pendientes (esto dependerá de tu API)
      let movimientosPendientes = [];
      try {
        const movimientosResponse = await apiClient.get('/movimientos/pendientes');
        movimientosPendientes = movimientosResponse.data || [];
      } catch (err) {
        console.warn('No se pudieron obtener movimientos pendientes:', err);
        // Si no existe el endpoint, usar datos mock
        movimientosPendientes = [
          {
            id: 1,
            tipo: 'movimiento_interno',
            origen: 'Rack 1-1-A',
            destino: 'Rack 2-1-B',
            item: 'Material ABC',
            cantidad: 10,
            fechaCreacion: new Date().toISOString(),
            prioridad: 'alta'
          },
          {
            id: 2,
            tipo: 'reubicacion',
            origen: 'Rack 3-2-C',
            destino: 'Rack 1-3-A',
            item: 'Material XYZ',
            cantidad: 5,
            fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            prioridad: 'media'
          }
        ];
      }

      // Calcular estadísticas
      const posicionesUrgentes = posicionesParaChequear.filter(posicion => {
        if (!posicion.ultimo_chequeo) return true;
        const fechaChequeo = new Date(posicion.ultimo_chequeo);
        const diasTranscurridos = Math.floor((ahora - fechaChequeo) / (1000 * 60 * 60 * 24));
        return diasTranscurridos > 30; // Más de 30 días
      }).length;

      const movimientosUrgentes = movimientosPendientes.filter(mov => 
        mov.prioridad === 'alta' || 
        (new Date() - new Date(mov.fechaCreacion)) > 7 * 24 * 60 * 60 * 1000
      ).length;

      setTareas({
        posicionesParaChequear,
        movimientosPendientes,
        estadisticas: {
          totalPosicionesChequeo: posicionesParaChequear.length,
          posicionesUrgentes,
          movimientosPendientes: movimientosPendientes.length,
          movimientosUrgentes
        }
      });

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener tareas pendientes';
      setError(errorMessage);
      console.error('Error al obtener tareas pendientes:', err);
    } finally {
      setLoading(false);
    }
  };

  const calcularPrioridadChequeo = (fechaUltimoChequeo) => {
    if (!fechaUltimoChequeo) return 'alta';
    
    const ahora = new Date();
    const fechaChequeo = new Date(fechaUltimoChequeo);
    const diasTranscurridos = Math.floor((ahora - fechaChequeo) / (1000 * 60 * 60 * 24));
    
    if (diasTranscurridos > 30) return 'alta';
    if (diasTranscurridos > 14) return 'media';
    return 'baja';
  };

  const calcularPrioridadMovimiento = (movimiento) => {
    if (movimiento.prioridad) return movimiento.prioridad;
    
    const diasDesdeCreacion = Math.floor((new Date() - new Date(movimiento.fechaCreacion)) / (1000 * 60 * 60 * 24));
    
    if (diasDesdeCreacion > 7) return 'alta';
    if (diasDesdeCreacion > 3) return 'media';
    return 'baja';
  };

  const obtenerColorPrioridad = (prioridad) => {
    const colores = {
      'alta': '#F44336',    // Rojo
      'media': '#FF9800',  // Naranja
      'baja': '#4CAF50'     // Verde
    };
    return colores[prioridad] || '#9E9E9E';
  };

  useEffect(() => {
    obtenerTareasPendientes();
  }, []);

  return {
    ...tareas,
    loading,
    error,
    obtenerTareasPendientes,
    calcularPrioridadChequeo,
    calcularPrioridadMovimiento,
    obtenerColorPrioridad
  };
};
