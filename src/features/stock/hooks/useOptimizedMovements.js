import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  movimientoInterno, 
  adicionRapida, 
  ajusteStock,
  correccionItem,
  moveItemOptimistic,
  addItemToPosicionOptimistic,
  removeItemFromPosicionOptimistic,
  updatePosicionOptimistic
} from '../model/slice';
import { selectPosiciones } from '../model/selectors';

export const useOptimizedMovements = () => {
  const dispatch = useDispatch();
  const posiciones = useSelector(selectPosiciones);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'error' });

  // Función para mostrar notificación
  const showNotification = useCallback((message, severity = 'error') => {
    setNotification({ open: true, message, severity });
  }, []);

  // Función para cerrar notificación
  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const executeMovimientoInterno = useCallback(async (movimientoData) => {
    const { selectedItem, data, id } = movimientoData;
    
    // Guardar valores originales para revertir si falla
    const originalFromPosicion = posiciones.find(p => p.id === id);
    const originalToPosicion = posiciones.find(p => p.id === data.posicionDestinoId);
    const originalItem = originalFromPosicion?.items.find(i => i.id === selectedItem.id);
    
    // Actualización optimista inmediata
    dispatch(moveItemOptimistic({
      fromPosicionId: id,
      toPosicionId: data.posicionDestinoId,
      itemId: selectedItem.id,
      kilos: data.kilos,
      unidades: data.unidades
    }));

    try {
      const result = await dispatch(movimientoInterno(movimientoData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      // Revertir cambios optimistas si falla
      if (originalItem) {
        dispatch(moveItemOptimistic({
          fromPosicionId: data.posicionDestinoId,
          toPosicionId: id,
          itemId: selectedItem.id,
          kilos: originalItem.kilos,
          unidades: originalItem.unidades
        }));
      }
      
      showNotification(error.message || 'Error en movimiento interno', 'error');
      return { success: false, error: error.message };
    }
  }, [dispatch, posiciones, showNotification]);

  const executeAdicionRapida = useCallback(async (adicionData) => {
    const { posicionId, item } = adicionData;
    
    // Actualización optimista inmediata
    dispatch(addItemToPosicionOptimistic({
      posicionId,
      item
    }));

    try {
      const result = await dispatch(adicionRapida(adicionData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      // Revertir cambios optimistas si falla
      dispatch(removeItemFromPosicionOptimistic({
        posicionId,
        itemId: item.id,
        kilos: item.kilos,
        unidades: item.unidades
      }));
      
      showNotification(error.message || 'Error en adición rápida', 'error');
      return { success: false, error: error.message };
    }
  }, [dispatch, showNotification]);

  const executeAjusteStock = useCallback(async (ajusteData) => {
    const { posicionId, itemId, kilos, unidades } = ajusteData;
    
    // Guardar valores originales para revertir si falla
    const originalPosicion = posiciones.find(p => p.id === posicionId);
    const originalItem = originalPosicion?.items.find(i => i.id === itemId);
    
    // Actualización optimista inmediata
    dispatch(updatePosicionOptimistic({
      posicionId,
      itemId,
      kilos,
      unidades
    }));

    try {
      const result = await dispatch(ajusteStock(ajusteData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      // Revertir cambios optimistas si falla
      if (originalItem) {
        dispatch(updatePosicionOptimistic({
          posicionId,
          itemId,
          kilos: originalItem.kilos,
          unidades: originalItem.unidades
        }));
      }
      
      showNotification(error.message || 'Error en ajuste de stock', 'error');
      return { success: false, error: error.message };
    }
  }, [dispatch, posiciones, showNotification]);

  return {
    executeMovimientoInterno,
    executeAdicionRapida,
    executeAjusteStock,
    notification,
    closeNotification
  };
};
