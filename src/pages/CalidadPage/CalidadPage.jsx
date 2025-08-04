import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Alert,
  Snackbar,
  Container,
  Button
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchPartidasEnCuarentena } from '../../features/partidas/model/slice';
import { authService } from '../../services/authService';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import AppHeader from '../../shared/ui/AppHeader';
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
import styles from './CalidadPage.module.css';

export const CalidadPage = () => {
  const dispatch = useDispatch();
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

  // Cargar usuario y partidas al montar el componente
  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
    dispatch(fetchPartidasEnCuarentena());
  }, [dispatch]);

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

  if (!user) {
    return null;
  }

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando partidas...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppHeader user={user} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Error al cargar las partidas: {error}
          </Alert>
          <Button onClick={handleRefresh} variant="contained">
            Reintentar
          </Button>
        </Container>
      </Box>
    );
  }

  const renderPartidasGrid = (partidas, emptyStateProps) => {
    if (partidas.length === 0) {
      return <EmptyState {...emptyStateProps} searchTerm={searchTerm} />;
    }

    return (
      <Grid container spacing={3}>
        {partidas.map((partida) => (
          <Grid item xs={12} sm={6} md={4} key={partida.id}>
            <PartidaCard 
              partida={partida} 
              onAprobar={handleAprobarPartida}
              onRechazar={handleRechazarPartida}
              onVolverCuarentena={handleVolverCuarentena}
              onAprobarStock={handleAprobarStock}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader user={user} />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <div className={styles.container}>
          <Typography variant="h4" gutterBottom>
            Panel de Control - Calidad
          </Typography>
          

          
          {/* Barra de búsqueda */}
          <Box sx={{ mb: 3 }}>
            <SearchBar 
              placeholder="Buscar por número de partida, descripción, categoría o proveedor..."
              onSearch={handleSearch}
            />
          </Box>
          
          <Box sx={{ width: '100%', mt: 3 }}>
            <CalidadTabs 
              tabValue={tabValue}
              onTabChange={handleTabChange}
              partidasEnCuarentenaCount={filteredEnCuarentena.length}
              partidasAprobadasCount={filteredAprobadas.length}
            />
            
            <TabPanel value={tabValue} index={0}>
              <Paper elevation={2} sx={{ p: 3 }}>
                {renderPartidasGrid(filteredEnCuarentena, {
                  icon: InventoryIcon,
                  ...EMPTY_STATE_MESSAGES.CUARENTENA
                })}
              </Paper>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Paper elevation={2} sx={{ p: 3 }}>
                {renderPartidasGrid(filteredAprobadas, {
                  icon: CheckCircleIcon,
                  ...EMPTY_STATE_MESSAGES.APROBADAS
                })}
              </Paper>
            </TabPanel>
          </Box>
          
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
        </div>
      </Container>
    </Box>
  );
}; 