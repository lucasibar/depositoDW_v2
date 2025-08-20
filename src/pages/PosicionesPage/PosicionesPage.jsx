import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Grid,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Search as SearchIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import LoadingInfo from '../../shared/ui/LoadingInfo/LoadingInfo';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';

export const PosicionesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados del usuario y autenticación
  const [user, setUser] = useState(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    rack: '',
    fila: '',
    nivel: '',
    pasillo: ''
  });
  
  // Estados de resultados
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  // Opciones para los selectores
  const opcionesRack = ['A', 'B', 'C', 'D', 'E', 'F'];
  const opcionesFila = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const opcionesNivel = ['A', 'B'];
  const opcionesPasillo = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'];

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

  // Handlers del formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field === 'pasillo') {
        // Si se selecciona pasillo, limpiar rack, fila y nivel
        newData.pasillo = value;
        newData.rack = '';
        newData.fila = '';
        newData.nivel = '';
      } else {
        // Si se selecciona rack, fila o nivel, limpiar pasillo
        newData[field] = value;
        newData.pasillo = '';
      }
      
      return newData;
    });
  };

  const handleBuscar = async () => {
    // Validar que se haya seleccionado al menos una opción
    const tieneRack = formData.rack && formData.fila && formData.nivel;
    const tienePasillo = formData.pasillo;
    
    if (!tieneRack && !tienePasillo) {
      setNotification({
        open: true,
        message: 'Por favor selecciona una posición de rack (rack, fila, nivel) o un pasillo',
        severity: 'warning'
      });
      return;
    }

    setBuscando(true);
    try {
      console.log('Buscando posición:', formData);
      
      // Aquí iría la llamada a la API para buscar posiciones
      // Por ahora simulamos una respuesta
      const resultado = [
        {
          posicion: tieneRack ? `${formData.rack}-${formData.fila}-${formData.nivel}` : formData.pasillo,
          kilos: Math.floor(Math.random() * 1000) + 100,
          unidades: Math.floor(Math.random() * 50) + 10
        }
      ];
      
      setResultados(resultado);
      setNotification({
        open: true,
        message: `Se encontró 1 posición con stock`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al buscar posiciones:', error);
      setNotification({
        open: true,
        message: 'Error al buscar posiciones. Revisa la consola para más detalles.',
        severity: 'error'
      });
    } finally {
      setBuscando(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Renderizado condicional si no hay usuario
  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Posiciones">
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
            Consulta de Posiciones
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-secondary)',
              mb: isMobile ? 1 : 3
            }}
          >
            Busca posiciones por rack, fila, nivel o pasillo para ver el stock disponible
          </Typography>
        </Box>

        {/* Formulario de búsqueda */}
        <ModernCard
          title="Búsqueda por Posición"
          subtitle="Selecciona una posición de rack (rack, fila, nivel) o un pasillo"
          sx={{ mb: isMobile ? 2 : 4 }}
          padding={isMobile ? "compact" : "normal"}
        >
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? 1 : 2,
            alignItems: 'flex-end'
          }}>
            {/* Selector de Rack */}
            <Box sx={{ 
              flex: '1 1 150px',
              minWidth: '120px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Rack</InputLabel>
                <Select
                  value={formData.rack}
                  label="Rack"
                  onChange={(e) => handleInputChange('rack', e.target.value)}
                  disabled={!!formData.pasillo}
                >
                  {opcionesRack.map((rack) => (
                    <MenuItem key={rack} value={rack}>
                      {rack}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Selector de Fila */}
            <Box sx={{ 
              flex: '1 1 150px',
              minWidth: '120px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Fila</InputLabel>
                <Select
                  value={formData.fila}
                  label="Fila"
                  onChange={(e) => handleInputChange('fila', e.target.value)}
                  disabled={!!formData.pasillo}
                >
                  {opcionesFila.map((fila) => (
                    <MenuItem key={fila} value={fila}>
                      {fila}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Selector de Nivel */}
            <Box sx={{ 
              flex: '1 1 150px',
              minWidth: '120px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Nivel</InputLabel>
                <Select
                  value={formData.nivel}
                  label="Nivel"
                  onChange={(e) => handleInputChange('nivel', e.target.value)}
                  disabled={!!formData.pasillo}
                >
                  {opcionesNivel.map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      {nivel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Selector de Pasillo */}
            <Box sx={{ 
              flex: '1 1 150px',
              minWidth: '120px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Pasillo</InputLabel>
                <Select
                  value={formData.pasillo}
                  label="Pasillo"
                  onChange={(e) => handleInputChange('pasillo', e.target.value)}
                  disabled={!!(formData.rack || formData.fila || formData.nivel)}
                >
                  {opcionesPasillo.map((pasillo) => (
                    <MenuItem key={pasillo} value={pasillo}>
                      {pasillo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Botón de búsqueda */}
            <Box sx={{ 
              flex: '0 0 auto',
              minWidth: '120px'
            }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBuscar}
                disabled={buscando}
                startIcon={buscando ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{ 
                  minWidth: 120,
                  height: 56
                }}
              >
                {buscando ? 'Buscando...' : 'Buscar'}
              </Button>
            </Box>
          </Box>
        </ModernCard>

        {/* Resultados */}
        {resultados.length > 0 && (
          <ModernCard
            title={`Resultados (${resultados.length} posiciones)`}
            subtitle={`Stock disponible para la posición seleccionada`}
            padding={isMobile ? "compact" : "normal"}
          >
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={isMobile ? 1 : 2}>
                {resultados.map((resultado, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{
                      p: 2,
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: 'var(--color-background)',
                      '&:hover': {
                        backgroundColor: 'var(--color-divider)',
                        transition: 'var(--transition-normal)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <InventoryIcon sx={{ 
                          fontSize: 20, 
                          color: 'var(--color-primary)', 
                          mr: 1 
                        }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Posición {resultado.posicion}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Kilos:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {resultado.kilos} kg
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Unidades:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {resultado.unidades} un
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </ModernCard>
        )}

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  );
};
