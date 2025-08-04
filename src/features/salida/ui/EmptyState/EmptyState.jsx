import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  searchTerm = '' 
}) => {
  const showSearchMessage = searchTerm && searchTerm.trim().length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
        minHeight: 300
      }}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: 64,
            color: '#ccc',
            marginBottom: 2
          }}
        />
      )}
      
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{
          color: '#666',
          fontWeight: 500
        }}
      >
        {showSearchMessage 
          ? `No se encontraron salidas para "${searchTerm}"`
          : title
        }
      </Typography>
      
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          maxWidth: 400,
          lineHeight: 1.5
        }}
      >
        {showSearchMessage
          ? 'Intenta con otros términos de búsqueda o verifica la ortografía.'
          : description
        }
      </Typography>
    </Box>
  );
};

export default EmptyState; 