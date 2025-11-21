import { useState, useEffect } from 'react';
import { apiClient } from '../../../config/api';

export const useReporteStock = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReporteStock = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 useReporteStock: Obteniendo datos del reporte...');
      
      const response = await apiClient.get('/movimientos/reporte-stock-excel');
      
      if (response.data.success) {
        setData(response.data.data);
        console.log(`✅ useReporteStock: Datos obtenidos exitosamente. ${response.data.totalRegistros} registros`);
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (err) {
      console.error('❌ useReporteStock: Error al obtener datos:', err);
      setError(err.message || 'Error al obtener el reporte de stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReporteStock();
  }, []);

  const refetch = () => {
    fetchReporteStock();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};
