import React from "react";
import styles from "./MaterialCard.module.css";

export const MaterialCard = ({ 
  material, 
  variant = "default", // "stock", "deposito", "compras"
  onClick,
  children 
}) => {
  const getCardContent = () => {
    switch (variant) {
      case "stock":
        return (
          <>
            <h3 className={styles.title}>{material.item}</h3>
            <div className={styles.details}>
              <p><strong>Kilos:</strong> {material.kilos}</p>
              <p><strong>Unidades:</strong> {material.unidades}</p>
              {material.numeroPartida && (
                <p><strong>Partida:</strong> {material.numeroPartida}</p>
              )}
            </div>
          </>
        );
      case "deposito":
        return (
          <>
            <h3 className={styles.title}>{material.posicion}</h3>
            <div className={styles.details}>
              <p><strong>Item:</strong> {material.item}</p>
              <p><strong>Stock:</strong> {material.stock}</p>
            </div>
          </>
        );
      default:
        return children;
    }
  };

  return (
    <div 
      className={`${styles.card} ${styles[variant]}`}
      onClick={() => onClick?.(material)}
    >
      {getCardContent()}
    </div>
  );
};
