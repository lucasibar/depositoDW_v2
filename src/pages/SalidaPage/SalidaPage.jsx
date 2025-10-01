import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon,
  ExitToApp as ExitToAppIcon,
  History as HistoryIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import PageNavigationMenu from '../../components/PageNavigationMenu';
import { useLocation } from 'react-router-dom';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { GenerarSalidaTab } from './components/GenerarSalidaTab/GenerarSalidaTab';
import { GestionSalidaTab } from './components/GestionSalidaTab/GestionSalidaTab';

// Datos de las pestañas con iconos y contadores
const TABS = [
  { 
    id: 'generar-salida', 
    label: 'Generar Salida', 
    icon: <AddIcon />,
    component: GenerarSalidaTab,
    color: 'primary'
  },
  { 
    id: 'gestion-salida', 
    label: 'Salida Histórico', 
    icon: <HistoryIcon />,
    component: GestionSalidaTab,
    color: 'success'
  }
];

export const SalidaPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Estados para contadores (se pueden conectar con Redux más adelante)
  const [tabCounts, setTabCounts] = useState({
    'generar-salida': 0,
    'gestion-salida': 0
  });

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
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Salida">
      <Box sx={{ 
        p: isMobile ? 2 : 4,
        overflow: 'hidden',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <Box sx={{ 
          mb: isMobile ? 2 : 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <Box>
            <Typography 
              variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
              sx={{ 
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                mb: 0.5
              }}
            >
              Gestión de Salidas
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                mb: isMobile ? 1 : 3
              }}
            >
              Genera salidas rápidas y gestiona el inventario de salidas
            </Typography>
          </Box>
          {!isMobile && (
            <PageNavigationMenu user={user} currentPath={location.pathname} />
          )}
        </Box>

        {/* Tabs mejorados */}
        <ModernCard
          title={isMobile ? undefined : "Módulos de Salida"}
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
      </Box>
    </AppLayout>
  );
}; 