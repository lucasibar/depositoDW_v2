import { useState, useEffect } from 'react';
import { apiClient } from '../../../config/api';

export const useOcupacionDeposito = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/posiciones/estadisticas/ocupacion');
      setEstadisticas(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas de ocupación:', err);
      setError(err.response?.data?.message || 'Error al cargar las estadísticas de ocupación');
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
