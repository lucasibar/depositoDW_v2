import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { PosicionCard } from "../../shared/ui/PosicionCard/PosicionCard";

export const PosicionList = ({ 
  posiciones, 
  onPosicionClick,
  onMovimientoInterno,
  onCorreccion,
  searchTerm = ""
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (posiciones.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4,
        color: 'var(--color-text-secondary)'
      }}>
        <Typography variant={isMobile ? "body2" : "h6"}>
          No se encontraron posiciones
        </Typography>
        {searchTerm && (
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Intenta con otros términos de búsqueda
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: isMobile ? 1 : 2
    }}>
      {posiciones.map((posicion, index) => {
        // Crear una key única basada en los datos disponibles
        const uniqueKey = posicion.posicionId || `posicion-${index}`;
          
        return (
          <PosicionCard
            key={uniqueKey}
            posicion={posicion}
            onClick={onPosicionClick}
            onMovimientoInterno={onMovimientoInterno}
            onCorreccion={onCorreccion}
            searchTerm={searchTerm}
          />
        );
      })}
    </Box>
  );
}; 