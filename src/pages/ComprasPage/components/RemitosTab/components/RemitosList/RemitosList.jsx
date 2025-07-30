import React from 'react';
import { Box, Typography } from '@mui/material';
import { selectRemitos } from '../../../../../../features/remitos/model/selectors';
import { useSelector } from 'react-redux';

export const RemitosList = () => {
  const remitos = useSelector(selectRemitos);

  if (remitos.length === 0) {
    return (
      <Typography color="textSecondary">
        No hay remitos cargados. Crea uno nuevo para comenzar.
      </Typography>
    );
  }

  return (
    <Box>
      {remitos.map((remito) => (
        <Box 
          key={remito.id} 
          sx={{ 
            p: 2, 
            mb: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1,
            backgroundColor: '#fafafa'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Remito #{remito.numero}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Proveedor: {remito.proveedor}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Fecha: {new Date(remito.fecha).toLocaleDateString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}; 