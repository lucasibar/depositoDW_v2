import { useCallback, useEffect, useMemo, useState } from 'react';
import { filterStockPositions, itemMatchesSearchTerm } from '../utils/stockPageUtils';

export const useStockPageSearch = (data) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredData = useMemo(
    () => filterStockPositions(data, searchTerm),
    [data, searchTerm]
  );

  const selectedPosition = filteredData[selectedIndex] || null;

  useEffect(() => {
    if (selectedIndex >= filteredData.length) {
      setSelectedIndex(0);
    }
  }, [filteredData, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [data]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setSelectedIndex(0);
  }, []);

  const itemMatchesSearch = useCallback(
    (itemWrapper) => itemMatchesSearchTerm(itemWrapper, searchTerm),
    [searchTerm]
  );

  return {
    searchTerm,
    filteredData,
    selectedIndex,
    selectedPosition,
    setSelectedIndex,
    onSearchChange: handleSearchChange,
    itemMatchesSearch
  };
};

