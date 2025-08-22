import React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';
import { MovimientosUltimaSemana } from '../../../../features/salida/ui';



export const GestionSalidaTab = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Gestión de Salidas - Movimientos por Período
      </Typography>
      
      <MovimientosUltimaSemana />
    </Box>
  );
};
