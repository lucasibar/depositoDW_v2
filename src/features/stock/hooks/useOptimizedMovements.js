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
import { debugStockOperations } from '../utils/debugUtils';

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
    // Debug y validación
    debugStockOperations.logMovimientoInterno(movimientoData);
    const validationErrors = debugStockOperations.validateMovimientoInternoData(movimientoData);
    
    if (validationErrors.length > 0) {
      console.error('❌ Errores de validación en movimiento interno:', validationErrors);
      showNotification(`Errores de validación: ${validationErrors.join(', ')}`, 'error');
      return { success: false, error: validationErrors.join(', ') };
    }

    const { selectedItem, data, id } = movimientoData;
    
    // Guardar valores originales para revertir si falla
    const originalFromPosicion = posiciones.find(p => p.id === id || p.posicionId === id);
    const originalItem = originalFromPosicion?.items.find(i => i.id === selectedItem.itemId);
    
    // Para movimiento interno, necesitamos encontrar la posición destino basada en los datos
    let posicionDestinoId = null;
    
    // Debug: Mostrar algunas posiciones para entender la estructura
    // console.log('🔍 Debug: Estructura de posiciones disponibles:');
    // console.log('Primeras 3 posiciones:', posiciones.slice(0, 3).map(p => ({
    //   id: p.id,
    //   rack: p.rack,
    //   fila: p.fila,
    //   AB: p.AB,
    //   nivel: p.nivel,
    //   numeroPasillo: p.numeroPasillo,
    //   posicionId: p.posicionId,
    //   // Mostrar todas las propiedades para debug
    //   allProps: Object.keys(p)
    // })));
    
         if (data.pasillo !== undefined) {
       // Buscar posición por pasillo
       const posicionDestino = posiciones.find(p => p.numeroPasillo === data.pasillo);
       posicionDestinoId = posicionDestino?.id || posicionDestino?.posicionId;
     } else if (data.rack && data.fila && data.nivel) {
       // Buscar posición por rack, fila, nivel
       const posicionDestino = posiciones.find(p => 
         (p.rack === data.rack || p.rack === data.rack.toString()) && 
         (p.fila === data.fila || p.fila === data.fila.toString()) && 
         (p.AB === data.nivel || p.AB === data.nivel.toString())
       );
       posicionDestinoId = posicionDestino?.id || posicionDestino?.posicionId;
     }
    
         if (!posicionDestinoId) {
       showNotification('No se pudo encontrar la posición de destino', 'error');
       return { success: false, error: 'Posición de destino no encontrada' };
     }
    
    // Actualización optimista inmediata
    dispatch(moveItemOptimistic({
      fromPosicionId: id,
      toPosicionId: posicionDestinoId,
      itemId: selectedItem.itemId,
      kilos: selectedItem.kilos,
      unidades: selectedItem.unidades
    }));

    try {
      const result = await dispatch(movimientoInterno(movimientoData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      // Revertir cambios optimistas si falla
      if (originalItem && posicionDestinoId) {
        dispatch(moveItemOptimistic({
          fromPosicionId: posicionDestinoId,
          toPosicionId: id,
          itemId: selectedItem.itemId,
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
    // Debug y validación
    debugStockOperations.logAjusteStock(ajusteData);
    const validationErrors = debugStockOperations.validateAjusteStockData(ajusteData);
    
    if (validationErrors.length > 0) {
      console.error('❌ Errores de validación en ajuste de stock:', validationErrors);
      showNotification(`Errores de validación: ${validationErrors.join(', ')}`, 'error');
      return { success: false, error: validationErrors.join(', ') };
    }

    const { posicion, item } = ajusteData;
    
    // Guardar valores originales para revertir si falla
    const originalPosicion = posiciones.find(p => p.id === posicion || p.posicionId === posicion);
    const originalItem = originalPosicion?.items.find(i => i.id === item.itemId);
    
    // Actualización optimista inmediata - RESTAR de la posición
    dispatch(removeItemFromPosicionOptimistic({
      posicionId: posicion,
      itemId: item.itemId,
      kilos: ajusteData.kilos,
      unidades: ajusteData.unidades
    }));

    try {
      const result = await dispatch(ajusteStock(ajusteData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      // Revertir cambios optimistas si falla
      if (originalItem) {
        dispatch(addItemToPosicionOptimistic({
          posicionId: posicion,
          item: {
            id: item.itemId,
            kilos: originalItem.kilos,
            unidades: originalItem.unidades,
            categoria: item.categoria,
            descripcion: item.descripcion,
            proveedor: item.proveedor,
            partida: item.partida
          }
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
