import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Container,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { 
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  List as ListIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { OrdenesCompraTab } from './components/OrdenesCompraTab/OrdenesCompraTab';
import { PresupuestoTab } from './components/PresupuestoTab/PresupuestoTab';
import { RemitosListTab } from './components/RemitosListTab/RemitosListTab';

// Datos de las pestañas con iconos y contadores
const TABS = [
  { 
    id: 'listado-remitos', 
    label: 'Listado Remitos', 
    icon: <ListIcon />,
    component: RemitosListTab,
    color: 'info'
  },
  { 
    id: 'ordenes', 
    label: 'Órdenes de Compra', 
    icon: <ShoppingCartIcon />,
    component: OrdenesCompraTab,
    color: 'warning'
  },
  { 
    id: 'presupuesto', 
    label: 'Presupuesto', 
    icon: <AssessmentIcon />,
    component: PresupuestoTab,
    color: 'secondary'
  },
];

export const ComprasPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [user, setUser] = useState(null);

  // Estados para contadores (se pueden conectar con Redux más adelante)
  const [tabCounts, setTabCounts] = useState({
    'listado-remitos': 0,
    ordenes: 0,
    presupuesto: 0
  });

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Compras">
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
              Compras
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                mb: 3
              }}
            >
              Gestión integral de compras, stock y presupuestos
            </Typography>
          </Box>
        )}

        {/* Tabs mejorados */}
        <ModernCard
          title={isMobile ? undefined : "Módulos de Compras"}
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
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: isMobile ? 'center' : 'flex-start'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                          {tab.label}
                        </Typography>
                        {tabCounts[tab.id] > 0 && (
                          <Chip
                            label={tabCounts[tab.id]}
                            size="small"
                            color={tab.color}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              mt: isMobile ? 0.5 : 0
                            }}
                          />
                        )}
                      </Box>
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
        
        {/* Contenido de la pestaña activa - Sin títulos duplicados */}
        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          minHeight: '400px'
        }}>
          {ActiveComponent && <ActiveComponent />}
        </Box>
      </Container>
    </AppLayout>
  );
};