import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosicionesConItems } from '../model/slice';
import { selectPosiciones, selectStockLoading } from '../model/selectors';
import { cacheService } from '../../../services/cacheService';

export const usePosicionesCache = () => {
  const dispatch = useDispatch();
  const posiciones = useSelector(selectPosiciones);
  const isLoading = useSelector(selectStockLoading);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [error, setError] = useState(null);

  // Verificar si necesitamos cargar posiciones (cada 10 minutos)
  const shouldRefetch = useMemo(() => {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    return !isInitialized || (now - lastFetchTime) > tenMinutes;
  }, [isInitialized, lastFetchTime]);

  // Cargar posiciones solo cuando sea necesario
  useEffect(() => {
    if (shouldRefetch) {
      console.log('Cargando posiciones con items...');
      setError(null);
      
      dispatch(fetchPosicionesConItems())
        .unwrap()
        .then(() => {
          setLastFetchTime(Date.now());
          setIsInitialized(true);
          console.log('Posiciones cargadas exitosamente');
        })
        .catch((error) => {
          console.error('Error cargando posiciones:', error);
          setError(error.message || 'Error al cargar posiciones');
        });
    }
  }, [dispatch, shouldRefetch]);

  // Función para forzar recarga de posiciones
  const forceRefreshPosiciones = useCallback(() => {
    console.log('Forzando recarga de posiciones...');
    setError(null);
    
    dispatch(fetchPosicionesConItems())
      .unwrap()
      .then(() => {
        setLastFetchTime(Date.now());
        setIsInitialized(true);
        console.log('Posiciones recargadas exitosamente');
      })
      .catch((error) => {
        console.error('Error recargando posiciones:', error);
        setError(error.message || 'Error al recargar posiciones');
      });
  }, [dispatch]);

  // Función para limpiar caché y recargar
  const clearCacheAndRefresh = useCallback(() => {
    console.log('Limpiando caché y recargando posiciones...');
    cacheService.clear();
    forceRefreshPosiciones();
  }, [forceRefreshPosiciones]);

  // Función para obtener posición por ID
  const getPosicionById = useCallback((posicionId) => {
    return posiciones.find(p => p.id === posicionId);
  }, [posiciones]);

  // Función para buscar posiciones por nombre
  const searchPosiciones = useCallback((searchTerm) => {
    if (!searchTerm) return posiciones;
    
    const term = searchTerm.toLowerCase();
    return posiciones.filter(posicion => 
      posicion.nombre?.toLowerCase().includes(term) ||
      posicion.codigo?.toLowerCase().includes(term)
    );
  }, [posiciones]);

  // Función para obtener posiciones con stock
  const getPosicionesConStock = useCallback(() => {
    return posiciones.filter(posicion => 
      posicion.items && posicion.items.length > 0
    );
  }, [posiciones]);

  // Función para obtener posiciones vacías
  const getPosicionesVacias = useCallback(() => {
    return posiciones.filter(posicion => 
      !posicion.items || posicion.items.length === 0
    );
  }, [posiciones]);

  return {
    // Datos
    posiciones,
    isLoading,
    error,
    isInitialized,
    
    // Funciones de control
    forceRefreshPosiciones,
    clearCacheAndRefresh,
    
    // Funciones de utilidad
    getPosicionById,
    searchPosiciones,
    getPosicionesConStock,
    getPosicionesVacias,
    
    // Estadísticas
    stats: {
      total: posiciones.length,
      conStock: getPosicionesConStock().length,
      vacias: getPosicionesVacias().length,
      lastFetch: lastFetchTime,
      shouldRefetch
    }
  };
};
