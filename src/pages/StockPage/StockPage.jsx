import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { StockTab } from '../ComprasPage/components/StockTab/StockTab';

export const StockPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados del usuario y autenticación
  const [user, setUser] = useState(null);

  // Inicialización y autenticación
  useEffect(() => {
    const currentUser = checkAuthentication(navigate);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate]);

  // Handlers de navegación
  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  // Renderizado condicional si no hay usuario
  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Stock">
      <Box sx={{ 
        p: isMobile ? 2 : 4,
        overflow: 'hidden',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          <Typography 
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
            sx={{ 
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              mb: 0.5
            }}
          >
            Gestión de Stock
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-secondary)',
              mb: isMobile ? 1 : 3
            }}
          >
            Consulta y gestión del inventario disponible en el depósito
          </Typography>
        </Box>

        {/* Contenido del Stock */}
        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          minHeight: '400px'
        }}>
          <StockTab />
        </Box>
      </Box>
    </AppLayout>
  );
};
