import React from "react";
import { 
  calculateTotalKilos, 
  calculateTotalUnidades, 
  countUniqueMaterials 
} from "../../features/stock/utils/stockCalculations";
import { SUMMARY_LABELS, DEFAULT_VALUES } from "../../features/stock/constants/stockConstants";
import styles from "./StockSummary.module.css";

export const StockSummary = ({ materials }) => {
  const totalKilos = calculateTotalKilos(materials);
  const totalUnidades = calculateTotalUnidades(materials);
  const uniqueMaterialsCount = countUniqueMaterials(materials);
  const materialsLength = materials?.length || 0;

  return (
    <div className={styles.summary}>
      <div className={styles.summaryItem}>
        <span>{SUMMARY_LABELS.TOTAL_KILOS}</span>
        <strong>{totalKilos.toFixed(DEFAULT_VALUES.DECIMAL_PLACES)}</strong>
      </div>
      <div className={styles.summaryItem}>
        <span>{SUMMARY_LABELS.TOTAL_UNIDADES}</span>
        <strong>{totalUnidades}</strong>
      </div>
      <div className={styles.summaryItem}>
        <span>{SUMMARY_LABELS.MATERIALES}</span>
        <strong>{uniqueMaterialsCount}</strong>
      </div>
      <div className={styles.summaryItem}>
        <span>{SUMMARY_LABELS.PARTIDAS}</span>
        <strong>{materialsLength}</strong>
      </div>
    </div>
  );
};
