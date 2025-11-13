import { useCallback, useEffect, useState } from 'react';
import { stockApi } from '../api/stockApi';

export const useStockPageData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await stockApi.getConsultaRapidaAgrupado();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err?.message || 'Error al cargar composición por posición');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await stockApi.getConsultaRapidaAgrupado();
        if (isMounted) {
          setData(Array.isArray(result) ? result : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Error al cargar composición por posición');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refreshData: loadData
  };
};

