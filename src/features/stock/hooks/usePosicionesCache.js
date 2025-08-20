import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosicionesConItems } from '../model/slice';
import { selectPosiciones, selectStockLoading } from '../model/selectors';

export const usePosicionesCache = () => {
  const dispatch = useDispatch();
  const posiciones = useSelector(selectPosiciones);
  const isLoading = useSelector(selectStockLoading);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar posiciones manualmente
  const fetchPosiciones = useCallback(() => {
    console.log('Cargando posiciones con items...');
    setError(null);
    
    dispatch(fetchPosicionesConItems())
      .unwrap()
      .then(() => {
        setIsInitialized(true);
        console.log('Posiciones cargadas exitosamente');
      })
      .catch((error) => {
        console.error('Error cargando posiciones:', error);
        setError(error.message || 'Error al cargar posiciones');
      });
  }, [dispatch]);

  // Función para forzar recarga de posiciones (solo si es necesario)
  const forceRefreshPosiciones = useCallback(() => {
    console.log('Forzando recarga de posiciones...');
    setError(null);
    
    dispatch(fetchPosicionesConItems())
      .unwrap()
      .then(() => {
        console.log('Posiciones recargadas exitosamente');
      })
      .catch((error) => {
        console.error('Error recargando posiciones:', error);
        setError(error.message || 'Error al recargar posiciones');
      });
  }, [dispatch]);

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
    fetchPosiciones,
    forceRefreshPosiciones,
    
    // Funciones de utilidad
    getPosicionById,
    searchPosiciones,
    getPosicionesConStock,
    getPosicionesVacias,
    
    // Estadísticas
    stats: {
      total: posiciones.length,
      conStock: getPosicionesConStock().length,
      vacias: getPosicionesVacias().length
    }
  };
};
