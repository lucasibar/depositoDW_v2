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
        // Construir el título de manera directa
        const categoria = material.item?.categoria || '';
        const descripcion = material.item?.descripcion || '';
        
        let titulo = '';
        if (categoria && descripcion) {
          titulo = `${categoria} - ${descripcion}`;
        } else if (descripcion) {
          titulo = descripcion;
        } else if (categoria) {
          titulo = categoria;
        } else {
          titulo = 'Material sin información';
        }
        
        return (
          <>
            <h3 className={styles.title}>
              {titulo}
            </h3>
            <div className={styles.details}>
              <p><strong>Kilos:</strong> {material.kilos?.toFixed(2) || 0}</p>
              <p><strong>Unidades:</strong> {material.unidades || 0}</p>
              {material.partida?.numeroPartida && (
                <p><strong>Partida:</strong> {material.partida.numeroPartida}</p>
              )}
              {material.proveedor && (
                <p><strong>Proveedor:</strong> {material.proveedor}</p>
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
