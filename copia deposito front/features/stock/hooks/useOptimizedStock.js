import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockConsolidado, fetchPosicionesConItems } from "../model/slice";
import { selectStock, selectStockLoading, selectStockError } from "../model/selectors";
import { filterMaterialsBySearch } from "../utils/searchUtils";

import { useDebounce } from "../../../hooks/useDebounce";

export const useOptimizedStock = () => {
  const dispatch = useDispatch();
  const stock = useSelector(selectStock);
  const isLoading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);
  
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Usar debounce para optimizar búsquedas
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Verificar si necesitamos recargar datos (cada 5 minutos)
  const shouldRefetch = useMemo(() => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return !isInitialized || (now - lastFetchTime) > fiveMinutes;
  }, [isInitialized, lastFetchTime]);

  // Cargar datos solo cuando sea necesario
  useEffect(() => {
    if (shouldRefetch) {
      console.log('Cargando datos de stock...');
      dispatch(fetchStockConsolidado());
      setLastFetchTime(Date.now());
      setIsInitialized(true);
    }
  }, [dispatch, shouldRefetch]);

  // Actualizar materiales filtrados cuando cambie el stock o la búsqueda (con debounce)
  useEffect(() => {
    if (stock && stock.length > 0) {
      const filtered = debouncedSearchTerm 
        ? filterMaterialsBySearch(stock, debouncedSearchTerm)
        : stock;
      setFilteredMaterials(filtered);
    }
  }, [stock, debouncedSearchTerm]);

  // Función de búsqueda optimizada con debounce
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Función de reintento optimizada
  const handleRetry = useCallback(() => {
    console.log('Reintentando carga de datos...');
    dispatch(fetchStockConsolidado());
    setLastFetchTime(Date.now());
  }, [dispatch]);

  // Función para forzar recarga
  const forceRefresh = useCallback(() => {
    console.log('Forzando recarga de datos...');
    dispatch(fetchStockConsolidado());
    setLastFetchTime(Date.now());
  }, [dispatch]);

  // Función para cargar posiciones solo cuando se necesiten
  const loadPosiciones = useCallback(() => {
    dispatch(fetchPosicionesConItems());
  }, [dispatch]);

  return {
    stock,
    filteredMaterials,
    isLoading,
    error,
    searchTerm,
    isInitialized,
    handleSearch,
    handleRetry,
    forceRefresh,
    loadPosiciones,
    // Estadísticas de rendimiento
    performanceStats: {
      lastFetch: lastFetchTime,
      shouldRefetch
    }
  };
};
