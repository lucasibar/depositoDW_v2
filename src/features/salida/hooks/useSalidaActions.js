import { useState } from 'react';
import { SNACKBAR_MESSAGES } from '../constants/salidaConstants';

export const useSalidaActions = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCrearSalida = async (salidaData) => {
    setLoading(true);
    try {
      // TODO: Implementar llamada a API
      console.log('Creando salida:', salidaData);
      showSnackbar(SNACKBAR_MESSAGES.SALIDA_CREADA, 'success');
    } catch (error) {
      console.error('Error al crear salida:', error);
      showSnackbar(SNACKBAR_MESSAGES.ERROR_CREAR_SALIDA, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobarSalida = async (salidaId) => {
    setLoading(true);
    try {
      // TODO: Implementar llamada a API
      console.log('Aprobando salida:', salidaId);
      showSnackbar(SNACKBAR_MESSAGES.SALIDA_APROBADA, 'success');
    } catch (error) {
      console.error('Error al aprobar salida:', error);
      showSnackbar(SNACKBAR_MESSAGES.ERROR_APROBAR_SALIDA, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRechazarSalida = async (salidaId, motivo) => {
    setLoading(true);
    try {
      // TODO: Implementar llamada a API
      console.log('Rechazando salida:', salidaId, 'Motivo:', motivo);
      showSnackbar(SNACKBAR_MESSAGES.SALIDA_RECHAZADA, 'warning');
    } catch (error) {
      console.error('Error al rechazar salida:', error);
      showSnackbar(SNACKBAR_MESSAGES.ERROR_RECHAZAR_SALIDA, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletarSalida = async (salidaId) => {
    setLoading(true);
    try {
      // TODO: Implementar llamada a API
      console.log('Completando salida:', salidaId);
      showSnackbar(SNACKBAR_MESSAGES.SALIDA_COMPLETADA, 'success');
    } catch (error) {
      console.error('Error al completar salida:', error);
      showSnackbar(SNACKBAR_MESSAGES.ERROR_COMPLETAR_SALIDA, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSalida = async (salidaData) => {
    setLoading(true);
    try {
      // TODO: Implementar llamada a API para adición rápida
      console.log('Enviando salida:', salidaData);
      showSnackbar('Operación realizada correctamente', 'success');
      return Promise.resolve();
    } catch (error) {
      console.error('Error al enviar salida:', error);
      showSnackbar('Error al realizar la operación', 'error');
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    snackbar,
    handleCrearSalida,
    handleAprobarSalida,
    handleRechazarSalida,
    handleCompletarSalida,
    handleSubmitSalida,
    handleCloseSnackbar
  };
}; 