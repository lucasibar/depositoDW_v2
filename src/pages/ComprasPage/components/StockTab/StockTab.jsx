import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { MaterialList } from "../../../../widgets/MaterialList/MaterialList";
import { StockSummary } from "../../../../widgets/StockSummary/StockSummary";
import { fetchStockConsolidado } from "../../../../features/stock/model/slice";
import { selectStock, selectStockLoading, selectStockError } from "../../../../features/stock/model/selectors";
import { filterMaterialsBySearch } from "../../../../features/stock/utils/searchUtils";
import { SEARCH_PLACEHOLDERS, ERROR_MESSAGES } from "../../../../features/stock/constants/stockConstants";
import styles from "./StockTab.module.css";

export const StockTab = () => {
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

  const handleMaterialClick = (material) => {
    console.log("Material seleccionado:", material);
    // Aquí puedes agregar lógica específica para compras
    // Por ejemplo, abrir un modal con detalles o navegar a otra página
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{ERROR_MESSAGES.LOADING}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchStockConsolidado())} className={styles.retryButton}>
          {ERROR_MESSAGES.RETRY}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.stockTab}>
      <div className={styles.header}>
        <SearchBar 
          placeholder={SEARCH_PLACEHOLDERS.STOCK}
          onSearch={handleSearch}
        />
        <StockSummary materials={filteredMaterials} />
      </div>
      
      <MaterialList
        materials={filteredMaterials}
        variant="stock"
        onMaterialClick={handleMaterialClick}
      />
    </div>
  );
};
