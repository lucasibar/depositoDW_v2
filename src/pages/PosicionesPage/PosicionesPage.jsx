import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  MenuItem,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon,
  Inventory as InventoryIcon,
  SwapHoriz as SwapIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';
import { buscarItemsPorPosicion } from '../../features/adicionesRapidas/model/thunks';
import { selectNavegacionRapidaPosiciones } from '../../features/adicionesRapidas/model/selectors';
import { useNavegacionRapidaPosiciones } from '../../features/adicionesRapidas/hooks/useNavegacionRapidaPosiciones';
import { useNavegacionRapidaStock } from '../../features/adicionesRapidas/hooks/useNavegacionRapidaStock';
import MovimientoInterno from '../../components/MovimientoInterno/MovimientoInterno';
import AjustePosicionModal from '../../features/stock/ui/AjustePosicionModal';
import { apiClient } from '../../config/api';

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
  
  // Estados para movimiento interno
  const [movimientoInternoOpen, setMovimientoInternoOpen] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [posicionActual, setPosicionActual] = useState(null);
  
  // Estados para ajuste de stock
  const [modalAjusteOpen, setModalAjusteOpen] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);

  // Redux state
  const navegacionRapidaPosiciones = useSelector(selectNavegacionRapidaPosiciones);

  // Hook para navegación rápida
  const { limpiarEstadoNavegacion } = useNavegacionRapidaPosiciones();
  const { navegarAStockConBusqueda } = useNavegacionRapidaStock();

  // Inicialización y autenticación
  useEffect(() => {
    const currentUser = checkAuthentication(navigate);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate]);

  // Procesar navegación rápida cuando llegue desde materiales
  useEffect(() => {
    if (navegacionRapidaPosiciones.ejecutarBusqueda && navegacionRapidaPosiciones.posicionSeleccionada) {
      console.log('Procesando navegación rápida a posiciones:', navegacionRapidaPosiciones);
      
      // Configurar el formulario con los datos de navegación rápida
      const posicion = navegacionRapidaPosiciones.posicionSeleccionada;
      
      if (posicion.rack && posicion.fila && posicion.nivel) {
        // Posición con rack, fila y nivel
        setFormData({
          rack: posicion.rack,
          fila: posicion.fila,
          nivel: posicion.nivel,
          pasillo: ''
        });
        
        // Ejecutar búsqueda automáticamente
        setTimeout(() => {
          handleBuscarAutomatica(posicion);
        }, 100);
      } else if (posicion.pasillo) {
        // Posición con pasillo
        setFormData({
          rack: '',
          fila: '',
          nivel: '',
          pasillo: posicion.pasillo
        });
        
        // Ejecutar búsqueda automáticamente
        setTimeout(() => {
          handleBuscarAutomaticaPasillo(posicion.pasillo);
        }, 100);
      } else if (posicion.entrada === true) {
        // Posición de entrada
        setFormData({
          rack: '',
          fila: '',
          nivel: '',
          pasillo: 'entrada'
        });
        
        // Ejecutar búsqueda automáticamente
        setTimeout(() => {
          handleBuscarEntrada();
        }, 100);
      }

      // Limpiar el estado de navegación rápida
      limpiarEstadoNavegacion();
    }
  }, [navegacionRapidaPosiciones, limpiarEstadoNavegacion]);

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
        
        // Si se selecciona "entrada", ejecutar la búsqueda automáticamente
        if (value === 'entrada') {
          setTimeout(() => handleBuscarEntrada(), 0);
        }
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
      
      // Obtener la posición actual para usar en el movimiento interno
      let posicionActual = null;
      if (tienePasillo) {
        const response = await apiClient.get(`/posiciones?numeroPasillo=${formData.pasillo}`);
        posicionActual = response.data[0];
      } else {
        const response = await apiClient.get(`/posiciones?rack=${formData.rack}&fila=${formData.fila}&AB=${formData.nivel}`);
        posicionActual = response.data[0];
      }
      setPosicionActual(posicionActual);
      
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

  // Función para búsqueda automática desde navegación rápida (rack/fila/nivel)
  const handleBuscarAutomatica = async (posicion) => {
    if (!posicion.rack || !posicion.fila || !posicion.nivel) {
      console.warn('Posición no válida para búsqueda automática:', posicion);
      return;
    }

    setBuscando(true);
    try {
      console.log('Búsqueda automática para posición:', posicion);
      
      // Obtener la posición actual
      const response = await apiClient.get(`/posiciones?rack=${posicion.rack}&fila=${posicion.fila}&AB=${posicion.nivel}`);
      const posicionActual = response.data[0];
      setPosicionActual(posicionActual);
      
      // Crear objeto con la estructura esperada
      const datosPosicion = {
        rack: posicion.rack,
        fila: posicion.fila,
        nivel: posicion.nivel
      };
      
      const resultado = await dispatch(buscarItemsPorPosicion(datosPosicion)).unwrap();
      
      setResultados(resultado);
      setNotification({
        open: true,
        message: `Búsqueda automática: Se encontraron ${resultado.length} items en la posición ${posicion.rack}-${posicion.fila}-${posicion.nivel}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error en búsqueda automática:', error);
      setNotification({
        open: true,
        message: error.message || 'Error en búsqueda automática',
        severity: 'error'
      });
    } finally {
      setBuscando(false);
    }
  };

  // Función para búsqueda automática desde navegación rápida (pasillo)
  const handleBuscarAutomaticaPasillo = async (numeroPasillo) => {
    if (!numeroPasillo) {
      console.warn('Número de pasillo no válido para búsqueda automática');
      return;
    }

    setBuscando(true);
    try {
      console.log('Búsqueda automática para pasillo:', numeroPasillo);
      
      // Obtener la posición actual
      const response = await apiClient.get(`/posiciones?numeroPasillo=${numeroPasillo}`);
      const posicionActual = response.data[0];
      setPosicionActual(posicionActual);
      
      // Crear objeto con la estructura esperada
      const datosPosicion = {
        pasillo: numeroPasillo
      };
      
      const resultado = await dispatch(buscarItemsPorPosicion(datosPosicion)).unwrap();
      
      setResultados(resultado);
      setNotification({
        open: true,
        message: `Búsqueda automática: Se encontraron ${resultado.length} items en el pasillo ${numeroPasillo}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error en búsqueda automática de pasillo:', error);
      setNotification({
        open: true,
        message: error.message || 'Error en búsqueda automática de pasillo',
        severity: 'error'
      });
    } finally {
      setBuscando(false);
    }
  };

  const handleBuscarEntrada = async () => {
    setBuscando(true);
    try {
      console.log('Buscando items en posición de entrada');
      
      // Buscar la posición de entrada (entrada: true, sin rack, fila, AB, pasillo)
      const response = await apiClient.get('/posiciones?entrada=true');
      const posicionEntrada = response.data.find(pos => 
        pos.entrada === true && 
        !pos.rack && 
        !pos.fila && 
        !pos.AB && 
        !pos.numeroPasillo
      );
      
      if (!posicionEntrada) {
        setNotification({
          open: true,
          message: 'No se encontró la posición de entrada',
          severity: 'error'
        });
        return;
      }
      
      setPosicionActual(posicionEntrada);
      
      // Crear un objeto con la estructura esperada por buscarItemsPorPosicion
      const datosEntrada = {
        entrada: true,
        posicionId: posicionEntrada.id
      };
      
      const resultado = await dispatch(buscarItemsPorPosicion(datosEntrada)).unwrap();
      
      setResultados(resultado);
      setNotification({
        open: true,
        message: `Se encontraron ${resultado.length} items en la posición de entrada`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al buscar items en entrada:', error);
      setNotification({
        open: true,
        message: error.message || 'Error al buscar items en la posición de entrada',
        severity: 'error'
      });
    } finally {
      setBuscando(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleMovimientoInterno = (item) => {
    console.log('PosicionesPage - handleMovimientoInterno llamado con:', item);
    console.log('PosicionesPage - posicionActual:', posicionActual);
    
    if (!posicionActual) {
      console.log('PosicionesPage - No hay posicionActual');
      setNotification({
        open: true,
        message: 'Error: No se pudo obtener la información de la posición',
        severity: 'error'
      });
      return;
    }
    
    console.log('PosicionesPage - Configurando modal con item:', item);
    setItemSeleccionado(item);
    setMovimientoInternoOpen(true);
    console.log('PosicionesPage - Modal abierto');
  };

  const handleMovimientoCompletado = () => {
    // Recargar los resultados después del movimiento
    handleBuscar();
  };

  // Handlers para ajuste de stock
  const handleAbrirModalAjuste = (material) => {
    console.log('Abriendo modal de ajuste para material:', material);
    console.log('Posición actual:', posicionActual);
    
    if (!posicionActual) {
      setNotification({
        open: true,
        message: 'Error: No se pudo obtener la información de la posición',
        severity: 'error'
      });
      return;
    }
    
    // Agregar la información de la posición al material
    const materialConPosicion = {
      ...material,
      posicion: posicionActual
    };
    
    setMaterialSeleccionado(materialConPosicion);
    setModalAjusteOpen(true);
  };

  const handleCerrarModalAjuste = () => {
    setModalAjusteOpen(false);
    setMaterialSeleccionado(null);
  };

  const handleAjusteExitoso = () => {
    console.log('Ajuste realizado exitosamente, recargando resultados...');
    setNotification({
      open: true,
      message: 'Ajuste realizado correctamente',
      severity: 'success'
    });
    // Recargar los resultados para mostrar el stock actualizado
    handleBuscar();
  };

  // Handler para click en carta de item
  const handleItemClick = (resultado) => {
    console.log('Item clickeado:', resultado);
    navegarAStockConBusqueda(resultado);
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
                  <MenuItem value="entrada">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon fontSize="small" />
                      Entrada
                    </Box>
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
                       cursor: 'pointer',
                       '&:hover': {
                         backgroundColor: 'var(--color-divider)',
                         transition: 'var(--transition-normal)',
                         transform: 'translateY(-2px)',
                         boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                       }
                     }}
                     onClick={() => handleItemClick(resultado)}
                   >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon sx={{ 
                          fontSize: 20, 
                          color: 'var(--color-primary)', 
                          mr: 1 
                        }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {resultado.item?.categoria || 'N/A'} - {resultado.item?.descripcion || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleAbrirModalAjuste(resultado)}
                          sx={{
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)',
                            '&:hover': {
                              borderColor: 'var(--color-primary-dark)',
                              backgroundColor: 'var(--color-primary-light)'
                            }
                          }}
                        >
                          Ajustar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<SwapIcon />}
                          onClick={() => handleMovimientoInterno(resultado)}
                          disabled={!posicionActual}
                        >
                          Mover
                        </Button>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Proveedor:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resultado.proveedor?.nombre || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Partida:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resultado.partida?.numeroPartida || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Kilos:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resultado.totalKilos || 0} kg
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Unidades:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {resultado.totalUnidades || 0} un
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

        {/* Modal de Movimiento Interno */}
        {console.log('PosicionesPage - Renderizando modal con:', { 
          movimientoInternoOpen, 
          itemSeleccionado, 
          posicionActual 
        })}
        <MovimientoInterno
          open={movimientoInternoOpen}
          onClose={() => setMovimientoInternoOpen(false)}
          itemSeleccionado={itemSeleccionado}
          posicionOrigen={posicionActual}
          onMovimientoCompletado={handleMovimientoCompletado}
        />

        {/* Modal de Ajuste de Stock desde Posiciones */}
        <AjustePosicionModal
          open={modalAjusteOpen}
          onClose={handleCerrarModalAjuste}
          material={materialSeleccionado}
          onAjusteExitoso={handleAjusteExitoso}
        />
      </Box>
    </AppLayout>
  );
};
