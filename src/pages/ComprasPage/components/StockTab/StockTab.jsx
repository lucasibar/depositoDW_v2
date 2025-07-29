import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { MaterialList } from "../../../../widgets/MaterialList/MaterialList";
import { StockSummary } from "../../../../widgets/StockSummary/StockSummary";
import { fetchStock } from "../../../../features/stock/model/slice";
import { selectStock, selectStockLoading, selectStockError } from "../../../../features/stock/model/selectors";
import styles from "./StockTab.module.css";

export const StockTab = () => {
  const dispatch = useDispatch();
  const stock = useSelector(selectStock);
  const isLoading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    dispatch(fetchStock());
  }, [dispatch]);

  useEffect(() => {
    setFilteredMaterials(stock);
  }, [stock]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredMaterials(stock);
      return;
    }

    const filtered = stock.filter(material =>
      material?.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material?.numeroPartida?.includes(searchTerm) ||
      material?.proveedor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        <p>Cargando materiales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchStock())} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.stockTab}>
      <div className={styles.header}>
        <SearchBar 
          placeholder="Buscar por material, número de partida o proveedor..."
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
