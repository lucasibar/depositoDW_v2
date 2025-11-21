import React from 'react';
import { Box, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  searchTerm 
}) => {
  const getTitle = () => {
    if (searchTerm) {
      return title || 'No se encontraron resultados';
    }
    return title || 'No hay elementos para mostrar';
  };

  const getDescription = () => {
    if (searchTerm) {
      return description || 'Intenta con otros términos de búsqueda';
    }
    return description || 'Los elementos aparecerán aquí cuando estén disponibles';
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={4}>
      <Icon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {getTitle()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {getDescription()}
      </Typography>
    </Box>
  );
};

export default EmptyState; 