import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { GenerarOrdenPedidoTab } from './components/GenerarOrdenPedidoTab/GenerarOrdenPedidoTab';
import { OrdenesPedidoTab } from './components/OrdenesPedidoTab/OrdenesPedidoTab';
import { PickingPorFechaTab } from './components/PickingPorFechaTab/PickingPorFechaTab';

// Datos de las pestañas con iconos
const TABS = [
  { 
    id: 'generar-orden', 
    label: 'Generar Orden Pedido', 
    icon: <ShoppingCartIcon />,
    component: GenerarOrdenPedidoTab,
    color: 'primary'
  },
  { 
    id: 'ordenes-pedido', 
    label: 'Órdenes de Pedidos', 
    icon: <AssignmentIcon />,
    component: OrdenesPedidoTab,
    color: 'info'
  },
  { 
    id: 'picking-fecha', 
    label: 'Picking por Fecha', 
    icon: <AssignmentIcon />,
    component: PickingPorFechaTab,
    color: 'secondary'
  }
];

export const ZonaPickingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);
  const [tabParams, setTabParams] = useState({});

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Escuchar evento para cambiar de pestaña
    const handleCambiarTab = (event) => {
      const { tabIndex, params } = event.detail;
      setActiveTab(tabIndex);
      if (params) {
        setTabParams(params);
      }
    };

    window.addEventListener('cambiarTab', handleCambiarTab);
    
    return () => {
      window.removeEventListener('cambiarTab', handleCambiarTab);
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setTabParams({}); // Limpiar parámetros al cambiar tab manualmente
  };

  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
  };

  if (!user) {
    return null;
  }

  const ActiveComponent = TABS[activeTab]?.component;

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Zona Picking">
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header solo en desktop */}
        {!isMobile && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                mb: 0.5
              }}
            >
              Zona Picking
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                mb: 3
              }}
            >
              Gestión de órdenes de pedido y picking por fecha
            </Typography>
          </Box>
        )}

        {/* Tabs mejorados */}
        <ModernCard
          title={isMobile ? undefined : "Módulos de Zona Picking"}
          subtitle={isMobile ? undefined : "Accede a las diferentes funcionalidades del sistema"}
          padding={isMobile ? "compact" : "normal"}
          sx={{ mb: isMobile ? 2 : 4 }}
        >
          <Box sx={{ 
            width: '100%',
            maxWidth: '100%'
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'var(--color-primary)',
                  height: 3,
                  borderRadius: '2px'
                },
                '& .MuiTab-root': {
                  minHeight: 56,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  '&.Mui-selected': {
                    color: 'var(--color-primary)',
                    fontWeight: 600
                  },
                  '&:hover': {
                    backgroundColor: 'var(--color-divider)',
                    color: 'var(--color-text-primary)'
                  }
                }
              }}
            >
              {TABS.map((tab, index) => (
                <Tab
                  key={tab.id}
                  label={
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      {tab.icon}
                      <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                        {tab.label}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    minWidth: isMobile ? 120 : 'auto',
                    px: isMobile ? 1 : 2
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </ModernCard>
        
        {/* Contenido de la pestaña activa */}
        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          minHeight: '400px'
        }}>
          {ActiveComponent && <ActiveComponent params={tabParams} />}
        </Box>
      </Container>
    </AppLayout>
  );
};
