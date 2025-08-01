import React from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useRemitos } from '../../../../../../features/remitos/hooks/useRemitos';

export const RemitosList = () => {
  const { remitos, isLoading, error, handleRetry } = useRemitos();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={handleRetry}>
        {error}
      </Alert>
    );
  }

  if (remitos.length === 0) {
    return (
      <Typography color="textSecondary">
        No hay remitos cargados. Crea uno nuevo para comenzar.
      </Typography>
    );
  }

  return (
    <Box>
      {remitos.map((remito, index) => (
        <Box 
          key={remito.id || `remito-${index}`} 
          sx={{ 
            p: 2, 
            mb: 2, 
            border: '1px solid #e0e0e0', 
            borderRadius: 1,
            backgroundColor: '#fafafa'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Remito #{remito.numeroRemito || remito.numero || 'Sin número'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Proveedor: {remito.proveedor?.nombre || 'Sin proveedor'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Fecha: {remito.fecha ? new Date(remito.fecha).toLocaleDateString() : 'Sin fecha'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Tipo: {remito.tipoMovimiento || 'Sin tipo'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}; 