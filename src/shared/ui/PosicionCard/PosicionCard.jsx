import React, { useState, useMemo } from "react";
import { 
  Button, 
  Box, 
  Typography, 
  Chip, 
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { 
  Add as AddIcon,
  SwapHoriz as SwapIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";
import { generatePosicionTitle, calculatePosicionTotalKilos, calculatePosicionTotalUnidades } from "../../../features/stock/utils/posicionUtils";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
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
    onClick?.(posicion);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
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

  const hasMoreItems = filteredItems.length > (isMobile ? 2 : 3);

  // Si no hay items filtrados y hay término de búsqueda, no mostrar la tarjeta
  if (searchTerm.trim() && filteredItems.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-md)',
        border: '1px solid var(--color-border)',
        p: isMobile ? 1.5 : 2,
        mb: 2,
        cursor: 'pointer',
        transition: 'var(--transition-normal)',
        '&:hover': {
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-1px)'
        }
      }}
      onClick={handleCardClick}
    >
      {/* Header con título y botón de adición rápida */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1.5
      }}>
        <Typography 
          variant={isMobile ? "body2" : "h6"} 
          sx={{ 
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            flex: 1
          }}
        >
          {titulo}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {/* Botón de Adición Rápida */}
          <IconButton
            size="small"
            onClick={handleAdicionRapida}
            sx={{ 
              color: 'var(--color-primary)',
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              '&:hover': {
                backgroundColor: 'var(--color-primary)',
                color: 'white'
              },
              p: 0.5
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          
          {/* Botón de expandir */}
          {hasMoreItems && (
            <IconButton
              size="small"
              onClick={handleExpandClick}
              sx={{ 
                color: 'var(--color-text-secondary)',
                p: 0.5
              }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Items visibles */}
      <Box sx={{ mb: 1.5 }}>
        {filteredItems.slice(0, isMobile ? 2 : 3).map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              py: 1,
              borderBottom: index < (isMobile ? 1 : 2) ? '1px solid var(--color-divider)' : 'none'
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Título del item con proveedor, categoría y descripción en una línea */}
              <Typography 
                variant={isMobile ? "caption" : "body2"}
                sx={{ 
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  mb: 0.5,
                  lineHeight: 1.3
                }}
              >
                {item.proveedor?.nombre && (
                  <Box component="span" sx={{ color: 'var(--color-secondary)', fontWeight: 500 }}>
                    {item.proveedor.nombre} - 
                  </Box>
                )}
                {item.categoria && `${item.categoria} - `}{item.descripcion || 'Sin descripción'}
              </Typography>
              
              {/* Pesos y unidades */}
              <Typography 
                variant="caption"
                sx={{ 
                  color: 'var(--color-text-secondary)',
                  display: 'block'
                }}
              >
                {item.kilos?.toFixed(1)} kg • {item.unidades} uds
                {item.partida && ` • P: ${item.partida}`}
              </Typography>
            </Box>
            
            {/* Acciones por item */}
            <Box sx={{ display: 'flex', gap: 0.5, ml: 1, mt: 0.5 }}>
              <IconButton
                size="small"
                onClick={(e) => handleMovimientoInterno(e, item)}
                sx={{ 
                  color: 'var(--color-secondary)',
                  p: 0.5
                }}
              >
                <SwapIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => handleCorreccion(e, item)}
                sx={{ 
                  color: 'var(--color-warning)',
                  p: 0.5
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Items expandidos */}
      <Collapse in={isExpanded}>
        <Box sx={{ mt: 1 }}>
          {filteredItems.slice(isMobile ? 2 : 3).map((item, index) => (
            <Box
              key={`expanded-${index}`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                py: 1,
                borderBottom: index < (filteredItems.length - (isMobile ? 2 : 3) - 1) ? '1px solid var(--color-divider)' : 'none'
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Título del item con proveedor, categoría y descripción en una línea */}
                <Typography 
                  variant="caption"
                  sx={{ 
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    mb: 0.5,
                    lineHeight: 1.3
                  }}
                >
                  {item.proveedor?.nombre && (
                    <Box component="span" sx={{ color: 'var(--color-secondary)', fontWeight: 500 }}>
                      {item.proveedor.nombre} - 
                    </Box>
                  )}
                  {item.categoria && `${item.categoria} - `}{item.descripcion || 'Sin descripción'}
                </Typography>
                
                {/* Pesos y unidades */}
                <Typography 
                  variant="caption"
                  sx={{ 
                    color: 'var(--color-text-secondary)',
                    display: 'block'
                  }}
                >
                  {item.kilos?.toFixed(1)} kg • {item.unidades} uds
                  {item.partida && ` • P: ${item.partida}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 0.5, ml: 1, mt: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={(e) => handleMovimientoInterno(e, item)}
                  sx={{ 
                    color: 'var(--color-secondary)',
                    p: 0.5
                  }}
                >
                  <SwapIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => handleCorreccion(e, item)}
                  sx={{ 
                    color: 'var(--color-warning)',
                    p: 0.5
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>

      {children}
    </Box>
  );
}; 