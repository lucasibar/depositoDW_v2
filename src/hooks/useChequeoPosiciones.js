import { useState } from 'react';
import { apiClient } from '../config/api';

export const useChequeoPosiciones = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const actualizarChequeo = async (posicionId, nombre) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post(`/posiciones/${posicionId}/chequeo`, {
        nombre
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el chequeo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    actualizarChequeo,
    loading,
    error
  };
};

