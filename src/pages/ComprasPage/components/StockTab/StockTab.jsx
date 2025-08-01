import React from "react";
import { useStockData } from "../../../../features/stock/hooks";
import { useComprasActions } from "../../../../features/compras/hooks";
import { LoadingState, ErrorState, StockContent } from "../../../../features/stock/ui";
import styles from "./StockTab.module.css";

export const StockTab = () => {
  const {
    filteredMaterials,
    isLoading,
    error,
    handleSearch,
    handleRetry
  } = useStockData();

  const { handleMaterialClick } = useComprasActions();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Error al cargar el stock</h3>
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={handleRetry}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.stockTab}>
      <StockContent
        filteredMaterials={filteredMaterials}
        onSearch={handleSearch}
        onMaterialClick={handleMaterialClick}
      />
    </div>
  );
};
