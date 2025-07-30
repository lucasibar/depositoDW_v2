import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export const RemitosHeader = ({ showForm, onToggleForm }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Gestión de Remitos
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={onToggleForm}
        sx={{ mb: 2 }}
      >
        {showForm ? 'Ocultar Formulario' : 'Crear Nuevo Remito'}
      </Button>
    </Box>
  );
}; 