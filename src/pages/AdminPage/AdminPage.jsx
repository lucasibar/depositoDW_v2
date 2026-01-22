import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { authService } from '../../services/auth/authService';
import { userService } from '../../services/userService';
import NotificacionesPanel from '../../features/notificaciones/ui/NotificacionesPanel';


export const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [creatingUsers, setCreatingUsers] = useState(false);
  const [userCreationResult, setUserCreationResult] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  const handleCreateDefaultUsers = async () => {
    setCreatingUsers(true);
    setUserCreationResult(null);
    
    try {
      const result = await userService.createDefaultUsers();
      setUserCreationResult(result);
    } catch (error) {
      setUserCreationResult({
        message: 'Error creando usuarios',
        error: error.message
      });
    } finally {
      setCreatingUsers(false);
    }
  };

  const renderDashboardTab = () => (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      {/* Estadísticas */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ 
        mb: isMobile ? 3 : 4,
        maxWidth: '100%'
      }}>
        <Grid item xs={6} sm={6} md={3}>
          <ModernCard
            title="Usuarios"
            subtitle="Total registrados"
            sx={{ height: '100%' }}
            padding={isMobile ? "compact" : "normal"}
          >
            <Box sx={{ textAlign: 'center', py: isMobile ? 1 : 2 }}>
              <PeopleIcon sx={{ fontSize: isMobile ? 32 : 48, color: 'var(--color-primary)', mb: isMobile ? 1 : 2 }} />
              <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                24
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <ModernCard
            title="Artículos"
            subtitle="En stock"
            sx={{ height: '100%' }}
            padding={isMobile ? "compact" : "normal"}
          >
            <Box sx={{ textAlign: 'center', py: isMobile ? 1 : 2 }}>
              <InventoryIcon sx={{ fontSize: isMobile ? 32 : 48, color: 'var(--color-secondary)', mb: isMobile ? 1 : 2 }} />
              <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 700, color: 'var(--color-secondary)' }}>
                1,247
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <ModernCard
            title="Movimientos"
            subtitle="Hoy"
            sx={{ height: '100%' }}
            padding={isMobile ? "compact" : "normal"}
          >
            <Box sx={{ textAlign: 'center', py: isMobile ? 1 : 2 }}>
              <TrendingUpIcon sx={{ fontSize: isMobile ? 32 : 48, color: 'var(--color-success)', mb: isMobile ? 1 : 2 }} />
              <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 700, color: 'var(--color-success)' }}>
                89
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <ModernCard
            title="Proveedores"
            subtitle="Activos"
            sx={{ height: '100%' }}
            padding={isMobile ? "compact" : "normal"}
          >
            <Box sx={{ textAlign: 'center', py: isMobile ? 1 : 2 }}>
              <BusinessIcon sx={{ fontSize: isMobile ? 32 : 48, color: 'var(--color-warning)', mb: isMobile ? 1 : 2 }} />
              <Typography variant={isMobile ? "h4" : "h3"} sx={{ fontWeight: 700, color: 'var(--color-warning)' }}>
                12
              </Typography>
            </Box>
          </ModernCard>
        </Grid>
      </Grid>

      {/* Actividad Reciente */}
      <ModernCard
        title={isMobile ? "Actividad" : "Actividad Reciente"}
        subtitle={isMobile ? "" : "Últimas actividades del sistema"}
        padding={isMobile ? "compact" : "normal"}
      >
        <Box sx={{ mt: isMobile ? 1 : 2 }}>
          {[
            { time: '10:30', text: 'Nuevo usuario registrado: Juan Pérez', type: 'user' },
            { time: '09:15', text: 'Movimiento de stock: Entrada de 50 unidades', type: 'stock' },
            { time: '08:45', text: 'Nuevo proveedor agregado: TextilCorp S.A.', type: 'provider' },
            { time: '08:30', text: 'Corrección de inventario: Posición A1-B2', type: 'correction' },
            { time: '08:15', text: 'Movimiento interno: Transferencia entre posiciones', type: 'transfer' }
          ].map((activity, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                py: isMobile ? 1 : 2,
                borderBottom: index < 4 ? '1px solid var(--color-divider)' : 'none',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <Chip
                label={activity.time}
                size="small"
                sx={{ 
                  mr: isMobile ? 1 : 2,
                  backgroundColor: 'var(--color-divider)',
                  color: 'var(--color-text-secondary)',
                  fontSize: isMobile ? '0.7rem' : '0.75rem'
                }}
              />
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                sx={{ 
                  color: 'var(--color-text-primary)',
                  lineHeight: isMobile ? 1.2 : 1.4
                }}
              >
                {activity.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </ModernCard>
    </Box>
  );

  const renderUsersTab = () => (
    <ModernCard
      title={isMobile ? "Usuarios" : "Gestión de Usuarios"}
      subtitle={isMobile ? "" : "Administra los usuarios del sistema"}
      padding={isMobile ? "compact" : "normal"}
    >
      <Box sx={{ mb: isMobile ? 2 : 3 }}>
        <Typography variant={isMobile ? "body2" : "h6"} sx={{ mb: isMobile ? 1 : 2 }}>
          Crear Usuarios por Defecto
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: isMobile ? 2 : 3 }}>
          Crea los usuarios básicos del sistema con roles específicos.
        </Typography>
        
        <Button 
          variant="contained"
          startIcon={creatingUsers ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={handleCreateDefaultUsers}
          disabled={creatingUsers}
          size={isMobile ? "small" : "medium"}
          sx={{
            backgroundColor: 'var(--color-primary)',
            '&:hover': {
              backgroundColor: 'var(--color-primary-dark)'
            }
          }}
        >
          {creatingUsers ? 'Creando...' : 'Crear Usuarios'}
        </Button>
      </Box>

      {userCreationResult && (
        <Alert 
          severity={userCreationResult.error ? 'error' : 'success'}
          sx={{ mb: 3 }}
        >
          {userCreationResult.message}
          {userCreationResult.error && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Error: {userCreationResult.error}
            </Typography>
          )}
        </Alert>
      )}
    </ModernCard>
  );

  const renderSystemTab = () => (
    <ModernCard
      title={isMobile ? "Sistema" : "Configuración del Sistema"}
      subtitle={isMobile ? "" : "Ajusta la configuración general del sistema"}
      padding={isMobile ? "compact" : "normal"}
    >
      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        Configuración del sistema en desarrollo...
      </Typography>
    </ModernCard>
  );

  const renderReportsTab = () => (
    <ModernCard
      title={isMobile ? "Reportes" : "Reportes y Estadísticas"}
      subtitle={isMobile ? "" : "Genera reportes detallados del sistema"}
      padding={isMobile ? "compact" : "normal"}
    >
      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
        Módulo de reportes en desarrollo...
      </Typography>
    </ModernCard>
  );

  const renderNotificacionesTab = () => (
    <NotificacionesPanel />
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <Box sx={{ 
        p: isMobile ? 2 : 4,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>

        {/* Tabs compactos */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'var(--color-border)', 
          mb: isMobile ? 2 : 3,
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              maxWidth: '100%',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minWidth: isMobile ? 80 : 120,
                maxWidth: isMobile ? 120 : 160,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                whiteSpace: 'nowrap'
              },
              '& .Mui-selected': {
                color: 'var(--color-primary)'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-primary)'
              },
              '& .MuiTabs-scrollButtons': {
                color: 'var(--color-primary)'
              }
            }}
          >
            <Tab label="Dashboard" value="dashboard" />
            <Tab label="Usuarios" value="users" />
            <Tab label="Sistema" value="system" />
            <Tab label="Reportes" value="reports" />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon sx={{ fontSize: '1rem' }} />
                  Notificaciones
                </Box>
              } 
              value="notificaciones" 
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ 
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'system' && renderSystemTab()}
          {activeTab === 'reports' && renderReportsTab()}
          {activeTab === 'notificaciones' && renderNotificacionesTab()}
        </Box>
      </Box>
    </AppLayout>
  );
}; 