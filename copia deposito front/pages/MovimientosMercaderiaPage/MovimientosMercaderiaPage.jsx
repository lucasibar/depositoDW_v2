import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  SwapHoriz as SwapHorizIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import PageNavigationMenu from '../../components/PageNavigationMenu';
import { authService } from '../../services/authService';

// Componentes
import PosicionesEntradaTab from './components/PosicionesEntradaTab';
import MovimientosRecomendadosTab from './components/MovimientosRecomendadosTab';

const MovimientosMercaderiaPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/depositoDW_v2/');
      return;
    }
    setUser(currentUser);
    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://derwill-deposito-backend.onrender.com/posiciones/recomendaciones-movimientos');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/depositoDW_v2/');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <AppLayout user={user} onLogout={handleLogout} pageTitle="Movimientos Mercadería">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Cargando recomendaciones de movimientos...
          </Typography>
        </Box>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout user={user} onLogout={handleLogout} pageTitle="Movimientos Mercadería">
        <Box p={3}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Reintentar
              </Button>
            }
          >
            Error al cargar los datos: {error}
          </Alert>
        </Box>
      </AppLayout>
    );
  }

  const { estadisticas, posicionesEntrada, movimientosRecomendados } = data || {};

  return (
    <AppLayout user={user} onLogout={handleLogout} pageTitle="Movimientos Mercadería">
      <Box sx={{ p: 3 }}>
        {/* Header con estadísticas */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
              Movimientos de Mercadería
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PageNavigationMenu user={user} currentPath={location.pathname} />
              <Tooltip title="Actualizar datos">
                <IconButton 
                  onClick={handleRefresh} 
                  disabled={refreshing}
                sx={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: 'white',
                  '&:hover': { backgroundColor: 'var(--color-primary-dark)' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            </Box>
          </Box>

          {/* Estadísticas principales */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                boxShadow: 'var(--shadow-md)'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InventoryIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {estadisticas?.itemsEnEntrada || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Items en Entrada
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                color: 'white',
                boxShadow: 'var(--shadow-md)'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SwapHorizIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {estadisticas?.movimientosRecomendados || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Movimientos Recomendados
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                color: 'white',
                boxShadow: 'var(--shadow-md)'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {estadisticas?.movimientosEntrada || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Desde Entrada
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                color: 'white',
                boxShadow: 'var(--shadow-md)'
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {estadisticas?.posicionesVacias || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Posiciones Vacías
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Información adicional */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'var(--color-background)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InfoIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Información del Sistema
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              El sistema analiza automáticamente las posiciones del depósito y recomienda movimientos 
              para optimizar la organización según las categorías ideales de cada posición.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={`Total Posiciones: ${estadisticas?.totalPosiciones || 0}`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={`Posiciones Entrada: ${estadisticas?.posicionesEntrada || 0}`} 
                size="small" 
                color="secondary" 
                variant="outlined" 
              />
              <Chip 
                label={`Reorganizaciones: ${estadisticas?.movimientosReorganizacion || 0}`} 
                size="small" 
                color="warning" 
                variant="outlined" 
              />
            </Box>
          </Paper>
        </Box>

        {/* Tabs de contenido */}
        <Paper sx={{ boxShadow: 'var(--shadow-sm)' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500
              }
            }}
          >
            <Tab 
              label={`Posiciones de Entrada (${posicionesEntrada?.length || 0})`}
              icon={<InventoryIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Movimientos Recomendados (${movimientosRecomendados?.length || 0})`}
              icon={<SwapHorizIcon />}
              iconPosition="start"
            />
          </Tabs>

          <Divider />

          {/* Contenido de las tabs */}
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <PosicionesEntradaTab 
                posicionesEntrada={posicionesEntrada}
                onRefresh={handleRefresh}
              />
            )}
            {activeTab === 1 && (
              <MovimientosRecomendadosTab 
                movimientosRecomendados={movimientosRecomendados}
                estadisticas={estadisticas}
                onRefresh={handleRefresh}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </AppLayout>
  );
};

export default MovimientosMercaderiaPage;
