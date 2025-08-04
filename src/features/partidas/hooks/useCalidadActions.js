import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { actualizarEstadoPartida } from '../model/slice';
import { PARTIDA_ESTADOS, SNACKBAR_MESSAGES } from '../constants/calidadConstants';

export const useCalidadActions = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const handleAction = async (action, partidaId, nuevoEstado, successMessage) => {
    setLoading(true);
    try {
      await dispatch(actualizarEstadoPartida({ 
        partidaId, 
        nuevoEstado 
      })).unwrap();
      
      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success'
      });
    } catch (error) {
      console.error(`Error al ${action} partida:`, error);
      setSnackbar({
        open: true,
        message: error || `Error al ${action} la partida`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAprobarPartida = (partidaId) => 
    handleAction('aprobar', partidaId, PARTIDA_ESTADOS.APROBADA, SNACKBAR_MESSAGES.PARTIDA_APROBADA);

  const handleRechazarPartida = (partidaId) => 
    handleAction('rechazar', partidaId, PARTIDA_ESTADOS.RECHAZADA, SNACKBAR_MESSAGES.PARTIDA_RECHAZADA);

  const handleVolverCuarentena = (partidaId) => 
    handleAction('devolver a cuarentena', partidaId, PARTIDA_ESTADOS.CUARENTENA, SNACKBAR_MESSAGES.PARTIDA_DEVUELTA);

  const handleAprobarStock = (partidaId) => {
    const confirmar = window.confirm('¿Se va a pasar esta mercadería a stock?');
    if (confirmar) {
      handleAction('aprobar para stock', partidaId, PARTIDA_ESTADOS.STOCK, SNACKBAR_MESSAGES.PARTIDA_APROBADA_STOCK);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    loading,
    snackbar,
    handleAprobarPartida,
    handleRechazarPartida,
    handleVolverCuarentena,
    handleAprobarStock,
    handleCloseSnackbar
  };
}; 