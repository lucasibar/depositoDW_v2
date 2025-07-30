import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { generatePosicionTitle, calculatePosicionTotalKilos, calculatePosicionTotalUnidades } from "../../../features/stock/utils/posicionUtils";
import styles from "./PosicionCard.module.css";

export const PosicionCard = ({ 
  posicion, 
  onClick,
  onAdicionRapida,
  onMovimientoInterno,
  onCorreccion,
  children 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const titulo = generatePosicionTitle(posicion);
  const totalKilos = calculatePosicionTotalKilos(posicion);
  const totalUnidades = calculatePosicionTotalUnidades(posicion);

  const handleCardClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (e) => {
    e.stopPropagation();
    onClick?.(posicion);
  };

  const handleAdicionRapida = (e) => {
    e.stopPropagation();
    onAdicionRapida?.(posicion);
  };

  const handleMovimientoInterno = (e, item) => {
    e.stopPropagation();
    onMovimientoInterno?.(item, posicion);
  };

  const handleCorreccion = (e, item) => {
    e.stopPropagation();
    onCorreccion?.(item, posicion);
  };

  const hasMoreItems = posicion.items && posicion.items.length > 3;

  return (
    <div 
      className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}
      onClick={handleCardClick}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{titulo}</h3>
        {hasMoreItems && (
          <span className={styles.expandIndicator}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>
      <div className={styles.details}>
        <p><strong>Total Kilos:</strong> {totalKilos.toFixed(2)}</p>
        <p><strong>Total Unidades:</strong> {totalUnidades}</p>
        <p><strong>Items:</strong> {posicion.items?.length || 0}</p>
        
        {/* Botón de Adición Rápida */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleAdicionRapida}
            sx={{ width: '100%' }}
          >
            + Adición Rápida
          </Button>
        </Box>
        {posicion.items && posicion.items.length > 0 && (
          <div className={styles.itemsList}>
            <p><strong>Materiales:</strong></p>
            {isExpanded ? (
              // Mostrar todos los items cuando está expandido
              posicion.items.map((item, index) => (
                <div key={index} className={styles.item} onClick={handleItemClick}>
                  <p className={styles.itemTitle}>
                    • {item.categoria} - {item.descripcion}
                  </p>
                  <div className={styles.itemDetails}>
                    <span><strong>Partida:</strong> {item.partida}</span>
                    <span><strong>Kilos:</strong> {item.kilos?.toFixed(2)}</span>
                    <span><strong>Unidades:</strong> {item.unidades}</span>
                    {item.proveedor?.nombre && (
                      <span><strong>Proveedor:</strong> {item.proveedor.nombre}</span>
                    )}
                  </div>
                  {/* Botones para cada item */}
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => handleMovimientoInterno(e, item)}
                    >
                      Mover
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={(e) => handleCorreccion(e, item)}
                    >
                      Corregir
                    </Button>
                  </Box>
                </div>
              ))
            ) : (
              // Mostrar solo los primeros 3 items cuando no está expandido
              <>
                {posicion.items.slice(0, 3).map((item, index) => (
                  <p key={index} className={styles.item}>
                    • {item.categoria} - {item.descripcion} (P: {item.partida})
                  </p>
                ))}
                {hasMoreItems && (
                  <p className={styles.moreItems}>
                    ... y {posicion.items.length - 3} más (click para expandir)
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 