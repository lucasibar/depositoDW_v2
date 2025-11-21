import { useCallback } from 'react';
import { apiClient } from '../../../config/api';
import {
  hasValidSelection,
  buildAdjustmentPayload,
  buildMovementPayload
} from '../utils/stockPageUtils';

export const useStockPageActions = (modals, refreshData, showNotification) => {
  const {
    selection,
    openMovimiento,
    openAjuste,
    openRemito,
    closeMovimiento,
    closeAjuste,
    closeRemito,
    closeAdicionRapida
  } = modals;

  const handleAjustar = useCallback(() => {
    if (!hasValidSelection(selection)) {
      return;
    }
    openAjuste(buildAdjustmentPayload(selection));
  }, [selection, openAjuste]);

  const handleMover = useCallback(() => {
    if (!hasValidSelection(selection)) {
      return;
    }
    openMovimiento(buildMovementPayload(selection));
  }, [selection, openMovimiento]);

  const handleRemitoSalida = useCallback(() => {
    if (!hasValidSelection(selection)) {
      return;
    }
    openRemito(buildMovementPayload(selection));
  }, [selection, openRemito]);

  const handleMovimientoCompletado = useCallback(async () => {
    await refreshData();
    closeMovimiento();
  }, [refreshData, closeMovimiento]);

  const handleAjusteExitoso = useCallback(async () => {
    showNotification('Ajuste realizado correctamente', 'success');
    await refreshData();
    closeAjuste();
  }, [closeAjuste, refreshData, showNotification]);

  const handleRemitoSalidaExitoso = useCallback(async () => {
    showNotification('Remito de salida creado correctamente', 'success');
    await refreshData();
    closeRemito();
  }, [closeRemito, refreshData, showNotification]);

  const handleAdicionRapidaSubmit = useCallback(
    async (adicionData) => {
      try {
        await apiClient.post('/movimientos/adicion-rapida', adicionData);
        showNotification('Adición rápida realizada correctamente', 'success');
        await refreshData();
        closeAdicionRapida();
      } catch (error) {
        console.error('Error en adición rápida:', error);
        const message =
          error.response?.data?.message ||
          'Error al realizar la adición rápida';
        showNotification(message, 'error');
      }
    },
    [closeAdicionRapida, refreshData, showNotification]
  );

  return {
    handleAjustar,
    handleMover,
    handleRemitoSalida,
    handleMovimientoCompletado,
    handleAjusteExitoso,
    handleRemitoSalidaExitoso,
    handleAdicionRapidaSubmit
  };
};

