import { useState, useEffect } from 'react';
import { apiClient } from '../config/api';

export const usePosicionesMapa = () => {
  const [data, setData] = useState({
    posiciones: [],
    categoriasDisponibles: [],
    totalPosiciones: 0,
    posicionesConMovimientos: 0,
    posicionesVacias: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosiciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/posiciones/map');
      setData(response.data);
      
      console.log('✅ Datos del mapa obtenidos:', response.data);
    } catch (err) {
      console.error('❌ Error al obtener datos del mapa:', err);
      setError(err.message || 'Error al obtener datos del mapa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosiciones();
  }, []);

  return {
    ...data,
    loading,
    error,
    refetch: fetchPosiciones
  };
};
