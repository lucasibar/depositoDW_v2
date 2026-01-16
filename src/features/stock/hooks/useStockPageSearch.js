import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { filterStockPositions, itemMatchesSearchTerm } from '../utils/stockPageUtils';

// Función helper para obtener un identificador único de la posición
const getPositionId = (position) => {
  if (!position || !position.posicion) return null;
  return position.posicion.id || null;
};

export const useStockPageSearch = (data) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedPositionIdRef = useRef(null);
  const previousSearchTermRef = useRef('');
  const previousDataRef = useRef(data);

  const filteredData = useMemo(
    () => filterStockPositions(data, searchTerm),
    [data, searchTerm]
  );

  const selectedPosition = filteredData[selectedIndex] || null;

  // Actualizar la referencia del ID cuando se selecciona manualmente una posición
  useEffect(() => {
    if (selectedPosition) {
      const positionId = getPositionId(selectedPosition);
      if (positionId) {
        selectedPositionIdRef.current = positionId;
      }
    }
  }, [selectedIndex, filteredData]);

  // Ajustar el índice si está fuera de rango
  useEffect(() => {
    if (selectedIndex >= filteredData.length && filteredData.length > 0) {
      setSelectedIndex(0);
      selectedPositionIdRef.current = null;
    }
  }, [filteredData, selectedIndex]);

  // Mantener la posición seleccionada cuando cambian los datos (después de remito, ajuste, etc.)
  useEffect(() => {
    const searchTermChanged = previousSearchTermRef.current !== searchTerm;
    const dataChanged = previousDataRef.current !== data;
    
    previousSearchTermRef.current = searchTerm;
    previousDataRef.current = data;

    if (filteredData.length === 0) {
      return;
    }

    // Si cambió el término de búsqueda, resetear la selección
    if (searchTermChanged) {
      setSelectedIndex(0);
      selectedPositionIdRef.current = null;
      return;
    }

    // Si los datos cambiaron (pero no el término de búsqueda), intentar mantener la posición
    if (dataChanged && selectedPositionIdRef.current) {
      const foundIndex = filteredData.findIndex(
        (position) => getPositionId(position) === selectedPositionIdRef.current
      );

      if (foundIndex !== -1) {
        // Si encontramos la posición, mantenerla seleccionada
        setSelectedIndex(foundIndex);
      } else {
        // Si no se encuentra, verificar si el índice actual es válido
        setSelectedIndex((currentIndex) => {
          if (currentIndex >= filteredData.length) {
            selectedPositionIdRef.current = null;
            return 0;
          }
          return currentIndex;
        });
      }
    }
  }, [data, filteredData, searchTerm]); // Removemos selectedIndex de las dependencias para evitar loops

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    // Al cambiar la búsqueda, resetear la selección
    setSelectedIndex(0);
    selectedPositionIdRef.current = null;
  }, []);

  const handleSetSelectedIndex = useCallback((index) => {
    setSelectedIndex(index);
    // Actualizar la referencia cuando se selecciona manualmente
    const position = filteredData[index];
    if (position) {
      const positionId = getPositionId(position);
      if (positionId) {
        selectedPositionIdRef.current = positionId;
      }
    }
  }, [filteredData]);

  const itemMatchesSearch = useCallback(
    (itemWrapper) => itemMatchesSearchTerm(itemWrapper, searchTerm),
    [searchTerm]
  );

  return {
    searchTerm,
    filteredData,
    selectedIndex,
    selectedPosition,
    setSelectedIndex: handleSetSelectedIndex,
    onSearchChange: handleSearchChange,
    itemMatchesSearch
  };
};

