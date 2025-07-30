import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockConsolidado } from "../model/slice";
import { selectStock, selectStockLoading, selectStockError } from "../model/selectors";
import { filterMaterialsBySearch } from "../utils/searchUtils";

export const useStockData = () => {
  const dispatch = useDispatch();
  const stock = useSelector(selectStock);
  const isLoading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    dispatch(fetchStockConsolidado());
  }, [dispatch]);

  useEffect(() => {
    setFilteredMaterials(stock);
  }, [stock]);

  const handleSearch = (searchTerm) => {
    const filtered = filterMaterialsBySearch(stock, searchTerm);
    setFilteredMaterials(filtered);
  };

  const handleRetry = () => {
    dispatch(fetchStockConsolidado());
  };

  return {
    stock,
    filteredMaterials,
    isLoading,
    error,
    handleSearch,
    handleRetry
  };
}; 