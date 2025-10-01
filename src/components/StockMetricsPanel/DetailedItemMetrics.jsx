import React from 'react';
import { 
  Box, 
  Typography, 
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  Scale as ScaleIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import styles from './StockMetricsPanel.module.css';

const DetailedItemMetrics = ({ itemData, searchTerm }) => {
  const theme = useTheme();

  // Calcular métricas específicas del item
  const calculateItemMetrics = () => {
    if (!itemData || !Array.isArray(itemData)) {
      return {
        totalKilos: 0,
        totalUnidades: 0,
        posicionesConStock: 0,
        partidasUnicas: 0,
        proveedores: new Set()
      };
    }

    let totalKilos = 0;
    let totalUnidades = 0;
    const partidasSet = new Set();
    const proveedoresSet = new Set();
    let posicionesConStock = 0;

    itemData.forEach(posicion => {
      if (posicion.items && posicion.items.length > 0) {
        posicion.items.forEach(item => {
          if (item.item?.id) {
            if (item.item?.proveedor?.id) {
              proveedoresSet.add(item.item.proveedor.nombre);
            }
            
            if (item.partidas && item.partidas.length > 0) {
              let tieneStock = false;
              item.partidas.forEach(partida => {
                if (partida.kilos > 0) {
                  totalKilos += partida.kilos;
                  totalUnidades += partida.unidades || 0;
                  tieneStock = true;
                  
                  if (partida.numeroPartida) {
                    partidasSet.add(partida.numeroPartida);
                  }
                }
              });
              
              if (tieneStock) {
                posicionesConStock++;
              }
            }
          }
        });
      }
    });

    return {
      totalKilos: Math.round(totalKilos * 100) / 100,
      totalUnidades,
      posicionesConStock,
      partidasUnicas: partidasSet.size,
      proveedores: Array.from(proveedoresSet)
    };
  };

  const metrics = calculateItemMetrics();

  // Detectar si hay un filtro específico de item
  const hasItemFilter = searchTerm && (
    searchTerm.toLowerCase().includes('algodon') ||
    searchTerm.toLowerCase().includes('nylon') ||
    searchTerm.toLowerCase().includes('costura') ||
    searchTerm.toLowerCase().includes('goma') ||
    searchTerm.toLowerCase().includes('tarugo') ||
    searchTerm.toLowerCase().includes('etiqueta') ||
    searchTerm.toLowerCase().includes('bolsa') ||
    searchTerm.toLowerCase().includes('percha') ||
    searchTerm.toLowerCase().includes('ribbon') ||
    searchTerm.toLowerCase().includes('caja') ||
    searchTerm.toLowerCase().includes('cinta') ||
    searchTerm.toLowerCase().includes('plantilla') ||
    searchTerm.toLowerCase().includes('film') ||
    searchTerm.toLowerCase().includes('consumibles')
  );

  if (!hasItemFilter || metrics.totalKilos === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.primary.light + '10', borderRadius: 2, border: `1px solid ${theme.palette.primary.light}30` }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
        📋 Análisis Detallado del Filtro
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Chip
          icon={<ScaleIcon />}
          label={`${metrics.totalKilos.toLocaleString()} kg totales`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<InventoryIcon />}
          label={`${metrics.totalUnidades.toLocaleString()} unidades`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          icon={<LocationIcon />}
          label={`${metrics.posicionesConStock} posiciones`}
          color="success"
          variant="outlined"
        />
        <Chip
          icon={<AssignmentIcon />}
          label={`${metrics.partidasUnicas} partidas`}
          color="warning"
          variant="outlined"
        />
      </Box>

      {metrics.proveedores.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Proveedores encontrados:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {metrics.proveedores.map((proveedor, index) => (
              <Chip
                key={index}
                icon={<BusinessIcon />}
                label={proveedor}
                size="small"
                color="info"
                variant="outlined"
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default DetailedItemMetrics;
