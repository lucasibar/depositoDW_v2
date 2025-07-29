import React from "react";
import { MaterialCard } from "../../shared/ui/MaterialCard/MaterialCard";
import styles from "./MaterialList.module.css";

export const MaterialList = ({ 
  materials, 
  variant = "stock",
  onMaterialClick 
}) => {
  if (materials.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No se encontraron materiales</p>
      </div>
    );
  }

  return (
    <div className={styles.materialList}>
      {materials.map((material) => (
        <MaterialCard
          key={material.id || material.numeroPartida}
          material={material}
          variant={variant}
          onClick={onMaterialClick}
        />
      ))}
    </div>
  );
};
