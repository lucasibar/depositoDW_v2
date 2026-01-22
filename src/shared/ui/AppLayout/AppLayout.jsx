import React from 'react';
import { 
  Box, 
  Typography
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import PageNavigationMenu from '../../../components/PageNavigationMenu/PageNavigationMenu';

const AppLayout = ({ children, user, onLogout, pageTitle }) => {
  const location = useLocation();

  // Función para obtener el título de la página basado en la ruta
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    const path = location.pathname;
    if (path.includes('/posiciones-vacias')) return 'Dashboard Depósito';
    if (path.includes('/posiciones-composicion')) return 'Stock';
    if (path.includes('/adicion-rapida')) return 'Adición Rápida';
    if (path.includes('/compras')) return 'Compras';
    if (path.includes('/remito-entrada')) return 'Remito Entrada';
    if (path.includes('/calidad')) return 'Calidad';
    if (path.includes('/admin')) return 'Dashboard';
    if (path.includes('/reportes')) return 'Reportes';
    if (path.includes('/mapa')) return 'Mapa del Depósito';
    if (path.includes('/chequeo-posiciones')) return 'Chequeo de Posiciones';
    if (path.includes('/remitos-salida')) return 'Remitos de Salida';
    if (path.includes('/movimientos-mercaderia')) return 'Movimientos Mercadería';
    if (path.includes('/busqueda-rapida')) return 'Búsqueda Rápida';
    return 'Der Will';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--color-background)'
    }}>
      {/* Header con título y menú */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {getPageTitle()}
        </Typography>
        <Box sx={{ position: 'relative', zIndex: 1200 }}>
          <PageNavigationMenu user={user} currentPath={location.pathname} />
        </Box>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: 'var(--color-background)',
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
