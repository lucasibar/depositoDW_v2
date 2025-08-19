import { useCallback } from 'react';
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
import { offlineSyncService } from '../../notificaciones/services/offlineSyncService';

export const useOptimizedMovements = () => {
  const dispatch = useDispatch();
  const posiciones = useSelector(selectPosiciones);

  // Movimiento interno optimista
  const executeMovimientoInterno = useCallback(async (movimientoData) => {
    const { selectedItem, data, id } = movimientoData;
    
    // Actualización optimista inmediata
    dispatch(moveItemOptimistic({
      fromPosicionId: id,
      toPosicionId: data.posicionDestinoId,
      itemId: selectedItem.id,
      kilos: data.kilos,
      unidades: data.unidades
    }));

    try {
      // Enviar al servidor en segundo plano
      const result = await dispatch(movimientoInterno(movimientoData)).unwrap();
      console.log('Movimiento interno exitoso:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en movimiento interno:', error);
      
      // Revertir cambios optimistas si falla
      dispatch(moveItemOptimistic({
        fromPosicionId: data.posicionDestinoId,
        toPosicionId: id,
        itemId: selectedItem.id,
        kilos: data.kilos,
        unidades: data.unidades
      }));
      
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  // Adición rápida optimista
  const executeAdicionRapida = useCallback(async (adicionData) => {
    const { posicionId, item } = adicionData;
    
    // Actualización optimista inmediata
    dispatch(addItemToPosicionOptimistic({
      posicionId,
      item
    }));

    try {
      // Enviar al servidor en segundo plano
      const result = await dispatch(adicionRapida(adicionData)).unwrap();
      console.log('Adición rápida exitosa:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en adición rápida:', error);
      
      // Revertir cambios optimistas si falla
      dispatch(removeItemFromPosicionOptimistic({
        posicionId,
        itemId: item.id,
        kilos: item.kilos,
        unidades: item.unidades
      }));
      
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  // Ajuste de stock optimista
  const executeAjusteStock = useCallback(async (ajusteData) => {
    const { posicionId, itemId, kilos, unidades } = ajusteData;
    
    // Actualización optimista inmediata
    dispatch(updatePosicionOptimistic({
      posicionId,
      itemId,
      kilos,
      unidades
    }));

    try {
      // Enviar al servidor en segundo plano
      const result = await dispatch(ajusteStock(ajusteData)).unwrap();
      console.log('Ajuste de stock exitoso:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en ajuste de stock:', error);
      
      // Revertir cambios optimistas si falla
      // Aquí necesitarías los valores originales para revertir
      
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  // Corrección de item optimista
  const executeCorreccionItem = useCallback(async (correccionData) => {
    const { posicionId, itemId, kilos, unidades } = correccionData;
    
    // Actualización optimista inmediata
    dispatch(updatePosicionOptimistic({
      posicionId,
      itemId,
      kilos,
      unidades
    }));

    try {
      // Enviar al servidor en segundo plano
      const result = await dispatch(correccionItem(correccionData)).unwrap();
      console.log('Corrección exitosa:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en corrección:', error);
      
      // Revertir cambios optimistas si falla
      // Aquí necesitarías los valores originales para revertir
      
      return { success: false, error: error.message };
    }
  }, [dispatch]);

  // Función para obtener posición por ID
  const getPosicionById = useCallback((posicionId) => {
    return posiciones.find(p => p.id === posicionId);
  }, [posiciones]);

  // Función para obtener item de posición
  const getItemFromPosicion = useCallback((posicionId, itemId) => {
    const posicion = getPosicionById(posicionId);
    return posicion?.items.find(i => i.id === itemId);
  }, [getPosicionById]);

  return {
    // Funciones de movimiento optimistas
    executeMovimientoInterno,
    executeAdicionRapida,
    executeAjusteStock,
    executeCorreccionItem,
    
    // Funciones de utilidad
    getPosicionById,
    getItemFromPosicion,
    
    // Datos
    posiciones
  };
};
