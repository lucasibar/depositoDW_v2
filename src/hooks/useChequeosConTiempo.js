import { useState, useEffect } from 'react';
import { apiClient } from '../config/api';

export const useChequeosConTiempo = () => {
  const [posiciones, setPosiciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPosicionesConChequeos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/posiciones/map');
      // El endpoint /posiciones/map devuelve posiciones con información de chequeos
      setPosiciones(response.data.posiciones || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener posiciones con chequeos';
      setError(errorMessage);
      console.error('Error al obtener posiciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const registrarChequeo = async (posicionId, nombre) => {
    try {
      await apiClient.post(`/posiciones/${posicionId}/chequeo`, { nombre });
      await obtenerPosicionesConChequeos();
      return { ok: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrar el chequeo';
      console.error('Error al registrar chequeo:', err);
      return { ok: false, error: errorMessage };
    }
  };

  const calcularEstadoChequeo = (fechaUltimoChequeo) => {
    if (!fechaUltimoChequeo) {
      return 'sin-chequeo';
    }

    const ahora = new Date();
    const fechaChequeo = new Date(fechaUltimoChequeo);
    const diasTranscurridos = Math.floor((ahora - fechaChequeo) / (1000 * 60 * 60 * 24));

    if (diasTranscurridos <= 7) {
      return 'reciente'; // Verde - Chequeado hace menos de 1 semana
    } else if (diasTranscurridos <= 14) {
      return 'semana'; // Amarillo - Chequeado hace 1-2 semanas
    } else if (diasTranscurridos <= 30) {
      return 'dos-semanas'; // Naranja - Chequeado hace 2 semanas - 1 mes
    } else {
      return 'mes'; // Rojo - Chequeado hace más de 1 mes
    }
  };

  const obtenerColorPorEstado = (estado) => {
    const colores = {
      'sin-chequeo': '#9E9E9E', // Gris - Sin chequeo
      'reciente': '#4CAF50',     // Verde - Reciente
      'semana': '#FFEB3B',       // Amarillo - 1 semana
      'dos-semanas': '#FF9800',  // Naranja - 2 semanas
      'mes': '#F44336'           // Rojo - Más de 1 mes
    };
    return colores[estado] || '#9E9E9E';
  };

  const obtenerDescripcionEstado = (estado) => {
    const descripciones = {
      'sin-chequeo': 'Sin chequeo',
      'reciente': 'Chequeado recientemente',
      'semana': 'Chequeado hace 1-2 semanas',
      'dos-semanas': 'Chequeado hace 2 semanas - 1 mes',
      'mes': 'Chequeado hace más de 1 mes'
    };
    return descripciones[estado] || 'Estado desconocido';
  };

  useEffect(() => {
    obtenerPosicionesConChequeos();
  }, []);

  return {
    posiciones,
    loading,
    error,
    obtenerPosicionesConChequeos,
    calcularEstadoChequeo,
    obtenerColorPorEstado,
    obtenerDescripcionEstado,
    registrarChequeo
  };
};
