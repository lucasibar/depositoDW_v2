import React from "react";
import { SearchBar } from "../../../../shared/ui/SearchBar/SearchBar";
import { MaterialList } from "../../../../widgets/MaterialList/MaterialList";
import { StockSummary } from "../../../../widgets/StockSummary/StockSummary";
import { ExportToExcelButton } from "../../../../shared/ui/ExportToExcelButton/ExportToExcelButton";
import { ExportMovimientosButton } from "../../../../shared/ui/ExportMovimientosButton/ExportMovimientosButton";
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
        <div className={styles.searchAndExport}>
          <SearchBar 
            placeholder={SEARCH_PLACEHOLDERS.STOCK}
            onSearch={onSearch}
          />
          <div className={styles.exportButtons}>
            <ExportToExcelButton 
              data={filteredMaterials}
              filename="stock_consolidado"
              sheetName="Stock"
            />
            <ExportMovimientosButton />
          </div>
        </div>
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