import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LeyendaChequeos = () => {
  const itemsLeyenda = [
    { color: '#4CAF50', texto: 'Chequeado recientemente (≤ 7 días)', estado: 'reciente' },
    { color: '#FFEB3B', texto: 'Chequeado hace 1-2 semanas', estado: 'semana' },
    { color: '#FF9800', texto: 'Chequeado hace 2 semanas - 1 mes', estado: 'dos-semanas' },
    { color: '#F44336', texto: 'Chequeado hace más de 1 mes', estado: 'mes' },
    { color: '#9E9E9E', texto: 'Sin chequeo registrado', estado: 'sin-chequeo' }
  ];

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 2, 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--color-text-primary)' }}>
        Leyenda de Estados de Chequeo
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {itemsLeyenda.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: item.color,
                borderRadius: '4px',
                border: '1px solid rgba(0,0,0,0.1)',
                flexShrink: 0
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem'
              }}
            >
              {item.texto}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          mt: 2, 
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic'
        }}
      >
        Los colores indican el tiempo transcurrido desde el último chequeo de cada posición
      </Typography>
    </Paper>
  );
};

export default LeyendaChequeos;
