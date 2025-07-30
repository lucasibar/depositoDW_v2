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
      {materials.map((material, index) => {
        // Crear una key única basada en los datos disponibles
        const uniqueKey = material.item?.id && material.partida?.id 
          ? `${material.item.id}-${material.partida.id}`
          : `material-${index}`;
          
        return (
          <MaterialCard
            key={uniqueKey}
            material={material}
            variant={variant}
            onClick={onMaterialClick}
          />
        );
      })}
    </div>
  );
};
