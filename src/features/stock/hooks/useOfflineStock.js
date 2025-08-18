import { useDispatch } from 'react-redux';
import { offlineSyncService } from '../../notificaciones/services/offlineSyncService';
import { 
  updatePosicionOptimistic,
  addItemToPosicionOptimistic,
  removeItemFromPosicionOptimistic,
  moveItemOptimistic
} from '../model/slice';

export const useOfflineStock = () => {
  const dispatch = useDispatch();

  // Adición rápida con actualización optimista
  const adicionRapidaOffline = async (data) => {
    const optimisticUpdate = () => {
      dispatch(addItemToPosicionOptimistic({
        posicionId: data.posicionId,
        item: {
          id: data.itemId,
          kilos: data.kilos,
          unidades: data.unidades,
          // Otros campos del item
        }
      }));
    };

    return await offlineSyncService.executeOperation('adicionRapida', data, optimisticUpdate);
  };

  // Ajuste de stock con actualización optimista
  const ajusteStockOffline = async (data) => {
    const optimisticUpdate = () => {
      dispatch(removeItemFromPosicionOptimistic({
        posicionId: data.posicionId,
        itemId: data.itemId,
        kilos: data.kilos,
        unidades: data.unidades
      }));
    };

    return await offlineSyncService.executeOperation('ajusteStock', data, optimisticUpdate);
  };

  // Movimiento interno con actualización optimista
  const movimientoInternoOffline = async (data) => {
    const optimisticUpdate = () => {
      dispatch(moveItemOptimistic({
        fromPosicionId: data.posicionOrigenId,
        toPosicionId: data.posicionDestinoId,
        itemId: data.itemId,
        kilos: data.kilos,
        unidades: data.unidades
      }));
    };

    return await offlineSyncService.executeOperation('movimientoInterno', data, optimisticUpdate);
  };

  // Corrección de item con actualización optimista
  const correccionItemOffline = async (data) => {
    const optimisticUpdate = () => {
      dispatch(updatePosicionOptimistic({
        posicionId: data.posicionId,
        itemId: data.itemId,
        kilos: data.kilos,
        unidades: data.unidades
      }));
    };

    return await offlineSyncService.executeOperation('correccionItem', data, optimisticUpdate);
  };

  return {
    adicionRapidaOffline,
    ajusteStockOffline,
    movimientoInternoOffline,
    correccionItemOffline
  };
};
