import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
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
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';
import { buscarItemsPorPosicion } from '../../features/adicionesRapidas/model/thunks';

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
    console.log(`handleInputChange - field: ${field}, value:`, value);
    
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
    // Validar que se haya seleccionado una posición
    const tienePasillo = formData.pasillo !== '';
    const tieneRack = formData.rack !== '' && formData.fila !== '' && formData.nivel !== '';
    
    if (!tienePasillo && !tieneRack) {
      setNotification({
        open: true,
        message: 'Por favor selecciona una posición (pasillo O rack/fila/nivel)',
        severity: 'warning'
      });
      return;
    }

    setBuscando(true);
    try {
      console.log('Buscando items por posición:', formData);
      
      const resultado = await dispatch(buscarItemsPorPosicion(formData)).unwrap();
      
      setResultados(resultado);
      setNotification({
        open: true,
        message: `Se encontraron ${resultado.length} items en la posición seleccionada`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al buscar items:', error);
      setNotification({
        open: true,
        message: error.message || 'Error al buscar items en la posición',
        severity: 'error'
      });
    } finally {
      setBuscando(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Generar opciones para los selectores
  const racks = Array.from({ length: 20 }, (_, i) => i + 1);
  const filas = Array.from({ length: 14 }, (_, i) => i + 1);
  const niveles = ['A', 'B'];
  const pasillos = Array.from({ length: 11 }, (_, i) => i + 1);

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
            Selecciona una posición para ver los items y partidas disponibles
          </Typography>
        </Box>

        {/* Formulario de búsqueda */}
        <ModernCard
          title="Búsqueda por Posición"
          subtitle="Selecciona pasillo O rack/fila/nivel (son mutuamente excluyentes)"
          sx={{ mb: isMobile ? 2 : 4 }}
          padding={isMobile ? "compact" : "normal"}
        >
          <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? 1 : 2,
            alignItems: 'flex-end'
          }}>
            {/* Selector de Pasillo */}
            <Box sx={{ 
              flex: '1 1 200px',
              minWidth: '200px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Pasillo</InputLabel>
                <Select
                  value={formData.pasillo}
                  onChange={(e) => handleInputChange('pasillo', e.target.value)}
                  disabled={formData.rack !== '' || formData.fila !== '' || formData.nivel !== ''}
                >
                  <MenuItem value="">
                    <em>Selecciona un pasillo</em>
                  </MenuItem>
                  {pasillos.map((pasillo) => (
                    <MenuItem key={pasillo} value={pasillo}>
                      Pasillo {pasillo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Selector de Rack */}
            <Box sx={{ 
              flex: '1 1 150px',
              minWidth: '150px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Rack</InputLabel>
                <Select
                  value={formData.rack}
                  onChange={(e) => handleInputChange('rack', e.target.value)}
                  disabled={formData.pasillo !== ''}
                >
                  <MenuItem value="">
                    <em>Selecciona rack</em>
                  </MenuItem>
                  {racks.map((rack) => (
                    <MenuItem key={rack} value={rack}>
                      Rack {rack}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Selector de Fila */}
            <Box sx={{ 
              flex: '1 1 150px',
              minWidth: '150px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Fila</InputLabel>
                <Select
                  value={formData.fila}
                  onChange={(e) => handleInputChange('fila', e.target.value)}
                  disabled={formData.pasillo !== ''}
                >
                  <MenuItem value="">
                    <em>Selecciona fila</em>
                  </MenuItem>
                  {filas.map((fila) => (
                    <MenuItem key={fila} value={fila}>
                      Fila {fila}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Selector de Nivel */}
            <Box sx={{ 
              flex: '1 1 150px',
              minWidth: '150px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Nivel</InputLabel>
                <Select
                  value={formData.nivel}
                  onChange={(e) => handleInputChange('nivel', e.target.value)}
                  disabled={formData.pasillo !== ''}
                >
                  <MenuItem value="">
                    <em>Selecciona nivel</em>
                  </MenuItem>
                  {niveles.map((nivel) => (
                    <MenuItem key={nivel} value={nivel}>
                      Nivel {nivel}
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
                disabled={buscando || (formData.pasillo === '' && (formData.rack === '' || formData.fila === '' || formData.nivel === ''))}
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
            title={`Resultados (${resultados.length} items)`}
            subtitle={`Items disponibles en la posición seleccionada`}
            padding={isMobile ? "compact" : "normal"}
          >
            <Box sx={{ mt: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: isMobile ? 1 : 2
              }}>
                {resultados.map((resultado, index) => (
                  <Box 
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: 'var(--color-background)',
                      '&:hover': {
                        backgroundColor: 'var(--color-divider)',
                        transition: 'var(--transition-normal)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InventoryIcon sx={{ 
                        fontSize: 20, 
                        color: 'var(--color-primary)', 
                        mr: 1 
                      }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {resultado.item?.categoria} - {resultado.item?.descripcion}
                      </Typography>
                    </Box>
                  
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Proveedor:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resultado.item?.proveedor?.nombre}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Partida:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resultado.partida}
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
                ))}
              </Box>
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
