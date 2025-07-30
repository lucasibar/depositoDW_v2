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
    return <ErrorState error={error} onRetry={handleRetry} />;
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
