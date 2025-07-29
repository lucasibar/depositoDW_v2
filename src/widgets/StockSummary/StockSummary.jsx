import React from "react";
import styles from "./StockSummary.module.css";

export const StockSummary = ({ materials }) => {
  const totalKilos = materials.reduce((sum, material) => sum + (material.kilos || 0), 0);
  const totalUnidades = materials.reduce((sum, material) => sum + (material.unidades || 0), 0);

  return (
    <div className={styles.summary}>
      <div className={styles.summaryItem}>
        <span>Total Kilos:</span>
        <strong>{totalKilos.toFixed(2)}</strong>
      </div>
      <div className={styles.summaryItem}>
        <span>Total Unidades:</span>
        <strong>{totalUnidades}</strong>
      </div>
      <div className={styles.summaryItem}>
        <span>Materiales:</span>
        <strong>{materials.length}</strong>
      </div>
    </div>
  );
};
