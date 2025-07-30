import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { MaterialList } from "../../../../widgets/MaterialList/MaterialList";
import { StockSummary } from "../../../../widgets/StockSummary/StockSummary";
import { fetchStockConsolidado } from "../../../../features/stock/model/slice";
import { selectStock, selectStockLoading, selectStockError } from "../../../../features/stock/model/selectors";
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
    if (!searchTerm.trim()) {
      setFilteredMaterials(stock);
      return;
    }

    // Dividir el término de búsqueda en palabras individuales
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    
    const filtered = stock.filter(material => {
      // Crear un string con todos los campos de búsqueda
      const searchableText = [
        material?.item?.descripcion || '',
        material?.item?.categoria || '',
        material?.partida?.numeroPartida || '',
        material?.proveedor || ''
      ].join(' ').toLowerCase();
      
      // Verificar si TODAS las palabras están presentes en el texto buscable
      return searchWords.every(word => searchableText.includes(word));
    });
    
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
        <button onClick={() => dispatch(fetchStockConsolidado())} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.stockTab}>
      <div className={styles.header}>
        <SearchBar 
          placeholder="Buscar por categoría, descripción, partida o proveedor (ej: nylon 16/1 negro rontaltex)..."
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
