import React from "react";
import { PosicionCard } from "../../shared/ui/PosicionCard/PosicionCard";
import styles from "./PosicionList.module.css";

export const PosicionList = ({ 
  posiciones, 
  onPosicionClick,
  onAdicionRapida,
  onMovimientoInterno,
  onCorreccion
}) => {
  if (posiciones.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No se encontraron posiciones</p>
      </div>
    );
  }

  return (
    <div className={styles.posicionList}>
      {posiciones.map((posicion, index) => {
        // Crear una key única basada en los datos disponibles
        const uniqueKey = posicion.posicionId || `posicion-${index}`;
          
        return (
          <PosicionCard
            key={uniqueKey}
            posicion={posicion}
            onClick={onPosicionClick}
            onAdicionRapida={onAdicionRapida}
            onMovimientoInterno={onMovimientoInterno}
            onCorreccion={onCorreccion}
          />
        );
      })}
    </div>
  );
}; 