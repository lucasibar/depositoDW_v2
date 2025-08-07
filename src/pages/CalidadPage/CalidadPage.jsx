import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Grid,
  Alert,
  Snackbar,
  Container,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchPartidasEnCuarentena } from '../../features/partidas/model/slice';
import { authService } from '../../services/authService';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { 
  PartidaCard, 
  CalidadTabs, 
  TabPanel, 
  EmptyState 
} from '../../features/partidas/ui';
import { 
  useCalidadActions, 
  usePartidasFilter 
} from '../../features/partidas/hooks';
import { EMPTY_STATE_MESSAGES } from '../../features/partidas/constants/calidadConstants';

export const CalidadPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { partidasEnCuarentena, partidasAprobadas, status, error } = useSelector(state => state.partidas);
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);

  const {
    loading,
    snackbar,
    handleAprobarPartida,
    handleRechazarPartida,
    handleVolverCuarentena,
    handleAprobarStock,
    handleCloseSnackbar
  } = useCalidadActions();

  const {
    searchTerm,
    filteredPartidas: filteredEnCuarentena,
    handleSearch: handleSearchEnCuarentena
  } = usePartidasFilter(partidasEnCuarentena);

  const {
    filteredPartidas: filteredAprobadas,
    handleSearch: handleSearchAprobadas
  } = usePartidasFilter(partidasAprobadas);

  // Debug logs
  console.log('CalidadPage render:', {
    status,
    partidasEnCuarentena: partidasEnCuarentena?.length || 0,
    partidasAprobadas: partidasAprobadas?.length || 0,
    filteredEnCuarentena: filteredEnCuarentena?.length || 0,
    filteredAprobadas: filteredAprobadas?.length || 0,
    tabValue,
    isMobile,
    isTablet,
    partidasEnCuarentenaDefined: !!partidasEnCuarentena,
    partidasAprobadasDefined: !!partidasAprobadas
  });

  // Cargar usuario y partidas al montar el componente
  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
    console.log('Dispatching fetchPartidasEnCuarentena');
    dispatch(fetchPartidasEnCuarentena());
  }, [dispatch]);

  // Debug effect para monitorear cambios en las partidas
  useEffect(() => {
    console.log('Partidas updated:', {
      enCuarentena: partidasEnCuarentena?.length || 0,
      aprobadas: partidasAprobadas?.length || 0,
      status
    });
  }, [partidasEnCuarentena, partidasAprobadas, status]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (term) => {
    handleSearchEnCuarentena(term);
    handleSearchAprobadas(term);
  };

  const handleRefresh = () => {
    dispatch(fetchPartidasEnCuarentena());
  };

  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
  };

  if (!user) {
    return null;
  }

  if (status === 'loading') {
    console.log('Rendering loading state');
    return (
      <AppLayout user={user} onLogout={handleLogoutClick}>
        <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh'
          }}>
            <Typography variant="h6" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
              Cargando partidas...
            </Typography>
          </Box>
        </Container>
      </AppLayout>
    );
  }

  if (status === 'failed') {
    console.log('Rendering error state:', error);
    return (
      <AppLayout user={user} onLogout={handleLogoutClick}>
        <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
          <ModernCard
            title="Error"
            subtitle="No se pudieron cargar las partidas"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            <Typography color="error" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleRefresh}
              sx={{ backgroundColor: 'var(--color-primary)' }}
            >
              Reintentar
            </Button>
          </ModernCard>
        </Container>
      </AppLayout>
    );
  }

  const renderPartidasGrid = (partidas, emptyStateProps) => {
    console.log('renderPartidasGrid called with:', { partidas: partidas.length, emptyStateProps });
    
    if (partidas.length === 0) {
      console.log('Rendering EmptyState');
      return <EmptyState {...emptyStateProps} searchTerm={searchTerm} />;
    }

    console.log('Rendering PartidaCards');
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: isMobile ? 0 : 1
      }}>
        {partidas.map((partida) => (
          <PartidaCard 
            key={partida.id}
            partida={partida} 
            onAprobar={handleAprobarPartida}
            onRechazar={handleRechazarPartida}
            onVolverCuarentena={handleVolverCuarentena}
            onAprobarStock={handleAprobarStock}
            loading={loading}
          />
        ))}
      </Box>
    );
  };

  console.log('Rendering main content');

  return (
    <AppLayout user={user} onLogout={handleLogoutClick}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 2 : 4,
          px: isMobile ? 2 : 3,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        {/* Header compacto */}
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          <Typography 
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
            sx={{ 
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              mb: 0.5
            }}
          >
            Calidad
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-secondary)',
              mb: isMobile ? 1 : 3
            }}
          >
            Gestión de partidas en cuarentena y aprobadas
          </Typography>
        </Box>

        {/* Barra de búsqueda */}
        <ModernCard
          title={isMobile || isTablet ? undefined : "Buscar Partidas"}
          subtitle={isMobile || isTablet ? undefined : "Encuentra rápidamente las partidas que necesitas revisar"}
          padding={isMobile ? "compact" : "normal"}
          sx={{ mb: isMobile ? 2 : 4 }}
        >
          <Box sx={{ 
            width: '100%',
            maxWidth: '100%'
          }}>
            <SearchBar 
              placeholder="Buscar por número de partida, descripción, categoría o proveedor..."
              onSearch={handleSearch}
            />
          </Box>
        </ModernCard>
        
        {/* Tabs y contenido */}
        <ModernCard
          title={isMobile ? undefined : "Estado de Partidas"}
          subtitle={isMobile ? undefined : "Gestiona el estado de las partidas"}
          padding={isMobile ? "compact" : "normal"}
        >
          <Box sx={{ 
            width: '100%',
            maxWidth: '100%'
          }}>
            <CalidadTabs 
              tabValue={tabValue}
              onTabChange={handleTabChange}
              partidasEnCuarentenaCount={filteredEnCuarentena.length}
              partidasAprobadasCount={filteredAprobadas.length}
            />
            
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mt: 2, width: '100%' }}>
                {console.log('Rendering Tab 0 - En Cuarentena:', filteredEnCuarentena.length)}
                {renderPartidasGrid(filteredEnCuarentena, {
                  icon: InventoryIcon,
                  ...EMPTY_STATE_MESSAGES.CUARENTENA
                })}
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mt: 2, width: '100%' }}>
                {console.log('Rendering Tab 1 - Aprobadas:', filteredAprobadas.length)}
                {renderPartidasGrid(filteredAprobadas, {
                  icon: CheckCircleIcon,
                  ...EMPTY_STATE_MESSAGES.APROBADAS
                })}
              </Box>
            </TabPanel>
          </Box>
        </ModernCard>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AppLayout>
  );
}; 