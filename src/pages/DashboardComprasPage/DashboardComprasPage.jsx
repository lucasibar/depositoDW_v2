import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Fab,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { authService } from '../../services/authService';
import { dashboardComprasService } from '../../services/dashboardComprasService';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { DashboardComprasCard } from '../../components/DashboardComprasCard/DashboardComprasCard';
import { ConfiguracionTarjetaModal } from '../../components/ConfiguracionTarjetaModal/ConfiguracionTarjetaModal';

export const DashboardComprasPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [user, setUser] = useState(null);
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
      cargarDashboard();
    }
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardComprasService.obtenerDashboard();
      setTarjetas(data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setError('Error al cargar el dashboard de compras');
    } finally {
      setLoading(false);
    }
  };

  const handleTarjetaClick = (tarjeta) => {
    console.log('Tarjeta clickeada:', tarjeta);
    // Aquí se puede agregar lógica adicional al hacer clic en la tarjeta
  };

  const handleConfigClick = (tarjeta) => {
    setTarjetaSeleccionada(tarjeta);
    setModalOpen(true);
  };

  const handleConfiguracionGuardada = (tarjetaId, itemIds) => {
    // Actualizar la tarjeta localmente
    setTarjetas(prev => prev.map(tarjeta => 
      tarjeta.id === tarjetaId 
        ? { ...tarjeta, itemIds }
        : tarjeta
    ));
    
    setSnackbar({
      open: true,
      message: 'Configuración guardada exitosamente',
      severity: 'success'
    });
    
    // Recargar el dashboard para obtener el stock actualizado
    setTimeout(() => {
      cargarDashboard();
    }, 1000);
  };

  const handleRefresh = () => {
    cargarDashboard();
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
  };

  const handleDescargarStock = async () => {
    try {
      setDescargando(true);
      const blob = await dashboardComprasService.descargarReporteStockExcel();
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generar nombre de archivo con fecha actual
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `reporte-stock-${fecha}.xlsx`;
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      window.URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: 'Reporte de stock descargado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error descargando reporte:', error);
      setSnackbar({
        open: true,
        message: 'Error al descargar el reporte de stock',
        severity: 'error'
      });
    } finally {
      setDescargando(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Dashboard de Compras">
      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header */}
        {!isMobile && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <DashboardIcon sx={{ fontSize: '2.5rem', color: 'primary.main' }} />
              <Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    mb: 0.5
                  }}
                >
                  Dashboard de Compras
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'var(--color-text-secondary)',
                    fontSize: '1.1rem'
                  }}
                >
                  Stock consolidado de materiales por categoría
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Contenido principal */}
        <ModernCard
          title={isMobile ? undefined : "Stock de Materiales"}
          subtitle={isMobile ? undefined : "Visualiza el stock total de cada tipo de material"}
          padding={isMobile ? "compact" : "normal"}
          sx={{ mb: isMobile ? 2 : 4 }}
        >
          {/* Botones de acción */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2,
            mb: 3 
          }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDescargarStock}
              disabled={descargando || loading}
              sx={{ borderRadius: 2 }}
            >
              {descargando ? 'Descargando...' : 'Descargar Stock'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Actualizar
            </Button>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 400,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={48} />
              <Typography variant="body1" color="text.secondary">
                Cargando dashboard...
              </Typography>
            </Box>
          ) : (
            /* Grid de tarjetas */
            <Grid container spacing={isMobile ? 2 : 3}>
              {tarjetas.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    color: 'text.secondary'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      No hay tarjetas configuradas
                    </Typography>
                    <Typography variant="body2">
                      Ejecuta el script de inicialización para crear las tarjetas por defecto
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                tarjetas.map((tarjeta) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={tarjeta.id}>
                    <DashboardComprasCard
                      tarjeta={tarjeta}
                      onClick={handleTarjetaClick}
                      onConfigClick={handleConfigClick}
                      isLoading={loading}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </ModernCard>

        {/* Modal de configuración */}
        <ConfiguracionTarjetaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          tarjeta={tarjetaSeleccionada}
          onConfiguracionGuardada={handleConfiguracionGuardada}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* FAB para acciones rápidas en móvil */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="refresh"
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <RefreshIcon />
          </Fab>
        )}
      </Container>
    </AppLayout>
  );
};
