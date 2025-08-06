import React, { useState, useMemo } from "react";
import { Button, Box } from "@mui/material";
import { generatePosicionTitle, calculatePosicionTotalKilos, calculatePosicionTotalUnidades } from "../../../features/stock/utils/posicionUtils";
import styles from "./PosicionCard.module.css";

export const PosicionCard = ({ 
  posicion, 
  onClick,
  onAdicionRapida,
  onMovimientoInterno,
  onCorreccion,
  searchTerm = "",
  children 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const titulo = generatePosicionTitle(posicion);
  
  // Filtrar items según el término de búsqueda
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim() || !posicion.items) {
      return posicion.items || [];
    }

    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    
    return posicion.items.filter(item => {
      const searchableText = [
        item.categoria || '',
        item.descripcion || '',
        item.partida || '',
        item.proveedor?.nombre || ''
      ].join(' ').toLowerCase();
      
      // Verificar si TODAS las palabras están presentes en el texto del item
      return searchWords.every(word => searchableText.includes(word));
    });
  }, [posicion.items, searchTerm]);

  // Calcular totales solo con los items filtrados
  const totalKilos = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + (item.kilos || 0), 0);
  }, [filteredItems]);

  const totalUnidades = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + (item.unidades || 0), 0);
  }, [filteredItems]);

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

  const hasMoreItems = filteredItems.length > 3;

  // Si no hay items filtrados y hay término de búsqueda, no mostrar la tarjeta
  if (searchTerm.trim() && filteredItems.length === 0) {
    return null;
  }

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
        <p><strong>Items:</strong> {filteredItems.length}</p>
        
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
        {filteredItems.length > 0 && (
          <div className={styles.itemsList}>
            <p><strong>Materiales:</strong></p>
            {isExpanded ? (
              // Mostrar todos los items filtrados cuando está expandido
              filteredItems.map((item, index) => (
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
                      color="error"
                      size="small"
                      onClick={(e) => handleCorreccion(e, item)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </div>
              ))
            ) : (
              // Mostrar solo los primeros 3 items filtrados cuando no está expandido
              <>
                {filteredItems.slice(0, 3).map((item, index) => (
                  <p key={index} className={styles.item}>
                    • {item.categoria} - {item.descripcion} (P: {item.partida})
                  </p>
                ))}
                {hasMoreItems && (
                  <p className={styles.moreItems}>
                    ... y {filteredItems.length - 3} más (click para expandir)
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