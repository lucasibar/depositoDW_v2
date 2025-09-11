import { useState, useEffect } from 'react';
import { apiClient } from '../../../config/api';

export const useMovimientosInternosPesados = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/movimientos/internos-pesados-ultimo-mes');
      setEstadisticas(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas de movimientos internos pesados:', err);
      setError(err.response?.data?.message || 'Error al cargar las estadísticas de movimientos internos pesados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  return {
    estadisticas,
    loading,
    error,
    recargarEstadisticas: cargarEstadisticas
  };
};
