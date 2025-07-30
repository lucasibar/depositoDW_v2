import React from "react";
import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { MaterialList } from "../../../../widgets/MaterialList/MaterialList";
import { StockSummary } from "../../../../widgets/StockSummary/StockSummary";
import { SEARCH_PLACEHOLDERS } from "../../constants/stockConstants";
import styles from "./StockContent.module.css";

export const StockContent = ({ 
  filteredMaterials, 
  onSearch, 
  onMaterialClick 
}) => {
  return (
    <div className={styles.stockContent}>
      <div className={styles.header}>
        <SearchBar 
          placeholder={SEARCH_PLACEHOLDERS.STOCK}
          onSearch={onSearch}
        />
        <StockSummary materials={filteredMaterials} />
      </div>
      
      <MaterialList
        materials={filteredMaterials}
        variant="stock"
        onMaterialClick={onMaterialClick}
      />
    </div>
  );
}; 