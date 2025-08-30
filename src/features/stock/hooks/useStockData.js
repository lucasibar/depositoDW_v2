import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockConsolidado } from "../model/slice";
import { selectStock, selectStockLoading, selectStockError } from "../model/selectors";
import { selectNavegacionRapidaStock } from "../../adicionesRapidas/model/selectors";
import { filterMaterialsBySearch } from "../utils/searchUtils";

export const useStockData = () => {
  const dispatch = useDispatch();
  const stock = useSelector(selectStock);
  const isLoading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);
  const navegacionRapidaStock = useSelector(selectNavegacionRapidaStock);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('🔄 useStockData: Iniciando fetchStockConsolidado');
    dispatch(fetchStockConsolidado());
  }, [dispatch]);

  useEffect(() => {
    console.log('📊 useStockData: Stock actualizado:', stock);
    console.log('📊 useStockData: Stock length:', stock?.length);
    setFilteredMaterials(stock || []);
  }, [stock]);

  // Procesar navegación rápida cuando llegue desde posiciones
  useEffect(() => {
    if (navegacionRapidaStock.ejecutarBusqueda && navegacionRapidaStock.itemSeleccionado && stock && stock.length > 0) {
      console.log('Procesando navegación rápida a stock:', navegacionRapidaStock);
      
      const item = navegacionRapidaStock.itemSeleccionado;
      const proveedor = navegacionRapidaStock.proveedorSeleccionado;
      
      // Crear una búsqueda más específica usando descripción del item y nombre del proveedor
      let searchQuery = '';
      
      if (item.descripcion) {
        searchQuery += item.descripcion;
      }
      
      if (proveedor) {
        // Si hay proveedor, agregarlo a la búsqueda para mayor precisión
        searchQuery += ` ${proveedor}`;
      }
      
      // Si no hay descripción, usar categoría como fallback
      if (!item.descripcion && item.categoria) {
        searchQuery = item.categoria;
        if (proveedor) {
          searchQuery += ` ${proveedor}`;
        }
      }
      
      console.log('Ejecutando búsqueda automática con:', searchQuery);
      setSearchTerm(searchQuery);
      handleSearch(searchQuery);
    }
  }, [navegacionRapidaStock, stock]);

  const handleSearch = (searchTerm) => {
    console.log('🔍 useStockData: Buscando:', searchTerm);
    setSearchTerm(searchTerm);
    const filtered = filterMaterialsBySearch(stock || [], searchTerm);
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
    searchTerm,
    handleSearch,
    handleRetry
  };
}; 