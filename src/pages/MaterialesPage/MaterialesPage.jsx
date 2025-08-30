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
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import AutocompleteSelect from '../../shared/ui/AutocompleteSelect/AutocompleteSelect';
import LoadingInfo from '../../shared/ui/LoadingInfo/LoadingInfo';
import { 
  cargarDatosIniciales,
  buscarMaterialesPorProveedorItem
} from '../../features/adicionesRapidas/model/thunks';
import { stockApi } from '../../features/stock/api/stockApi';
import { 
  selectProveedores, 
  selectItems, 
  selectAdicionesRapidasLoading, 
  selectAdicionesRapidasError,
  selectNavegacionRapida
} from '../../features/adicionesRapidas/model/selectors';
import { useAdicionRapida } from '../../features/adicionesRapidas/hooks/useAdicionRapida';
import { useNavegacionRapida } from '../../features/adicionesRapidas/hooks/useNavegacionRapida';
import { useNavegacionRapidaPosiciones } from '../../features/adicionesRapidas/hooks/useNavegacionRapidaPosiciones';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';
import AjusteMaterialModal from '../../features/stock/ui/AjusteMaterialModal';

export const MaterialesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados del usuario y autenticación
  const [user, setUser] = useState(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    proveedor: null,
    item: null
  });
  
  // Estados de resultados
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Estados del modal de ajuste
  const [modalAjusteOpen, setModalAjusteOpen] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] = useState(null);

  // Redux state
  const proveedores = useSelector(selectProveedores);
  const items = useSelector(selectItems);
  const loading = useSelector(selectAdicionesRapidasLoading);
  const error = useSelector(selectAdicionesRapidasError);
  const navegacionRapida = useSelector(selectNavegacionRapida);

  // Hook personalizado para filtrado
  const { itemsFiltrados, filterProveedores, filterItems } = useAdicionRapida(
    proveedores, 
    items, 
    formData.proveedor
  );

  // Hook para navegación rápida
  const { limpiarEstadoNavegacion } = useNavegacionRapida();
  const { navegarAPosicionesConBusqueda } = useNavegacionRapidaPosiciones();

  // Debug logs para ajuste de materiales
  console.log('MaterialesPage - Estado actual:', {
    itemSeleccionado: formData.item?.id,
    resultados: resultados.length,
    modalAjusteOpen: modalAjusteOpen,
    navegacionRapida
  });

  // Inicialización y autenticación
  useEffect(() => {
    const currentUser = checkAuthentication(navigate);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      dispatch(cargarDatosIniciales());
    }
  }, [dispatch, user]);

  // Procesar navegación rápida cuando llegue desde stock
  useEffect(() => {
    if (navegacionRapida.ejecutarBusqueda && navegacionRapida.itemSeleccionado && proveedores.length > 0 && items.length > 0) {
      console.log('Procesando navegación rápida:', navegacionRapida);
      
      // Configurar el formulario con los datos de navegación rápida
      const itemEncontrado = items.find(item => item.id === navegacionRapida.itemSeleccionado.id);
      const proveedorEncontrado = navegacionRapida.proveedorSeleccionado 
        ? proveedores.find(p => p.nombre === navegacionRapida.proveedorSeleccionado)
        : null;

      if (itemEncontrado) {
        setFormData({
          proveedor: proveedorEncontrado?.nombre || '',
          item: itemEncontrado
        });

        // Ejecutar búsqueda automáticamente
        setTimeout(() => {
          handleBuscarAutomatica(itemEncontrado);
        }, 100);

        // Limpiar el estado de navegación rápida
        limpiarEstadoNavegacion();
      }
    }
  }, [navegacionRapida, proveedores, items, limpiarEstadoNavegacion]);

  // Handlers de navegación
  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  // Handlers del formulario
  const handleInputChange = (field, value) => {
    if (field === 'proveedor') {
      // Para proveedor, guardar solo el nombre como string
      const proveedorNombre = value?.nombre || value || '';
      
      setFormData(prev => ({
        ...prev,
        proveedor: proveedorNombre,
        item: null // Limpiar item cuando cambia proveedor
      }));
    } else if (field === 'item') {
      // Para item, guardar el objeto completo
      setFormData(prev => ({
        ...prev,
        item: value
      }));
    }
  };

  const handleBuscar = async () => {
    if (!formData.item) {
      setNotification({
        open: true,
        message: 'Por favor selecciona un item',
        severity: 'warning'
      });
      return;
    }

    // Validar que el item tenga ID
    if (!formData.item.id) {
      setNotification({
        open: true,
        message: 'El item seleccionado no tiene ID válido',
        severity: 'warning'
      });
      return;
    }

    setBuscando(true);
    try {
      console.log('Buscando materiales para item ID:', formData.item.id);
      
      const resultado = await stockApi.buscarMaterialesPorItemId(formData.item.id);
      console.log('Resultados de búsqueda:', resultado);
      
      setResultados(resultado);
      setNotification({
        open: true,
        message: `Se encontraron ${resultado.length} posiciones con stock`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al buscar materiales:', error);
      setNotification({
        open: true,
        message: 'Error al buscar materiales. Revisa la consola para más detalles.',
        severity: 'error'
      });
    } finally {
      setBuscando(false);
    }
  };

  // Función para búsqueda automática desde navegación rápida
  const handleBuscarAutomatica = async (item) => {
    if (!item || !item.id) {
      console.warn('Item no válido para búsqueda automática:', item);
      return;
    }

    setBuscando(true);
    try {
      console.log('Búsqueda automática para item ID:', item.id);
      
      const resultado = await stockApi.buscarMaterialesPorItemId(item.id);
      console.log('Resultados de búsqueda automática:', resultado);
      
      setResultados(resultado);
      setNotification({
        open: true,
        message: `Búsqueda automática: Se encontraron ${resultado.length} posiciones con stock`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error en búsqueda automática:', error);
      setNotification({
        open: true,
        message: 'Error en búsqueda automática. Revisa la consola para más detalles.',
        severity: 'error'
      });
    } finally {
      setBuscando(false);
    }
  };

  // Handler para click en carta de posición
  const handlePosicionClick = (resultado) => {
    console.log('Posición clickeada:', resultado);
    navegarAPosicionesConBusqueda(resultado);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Handlers del modal de ajuste
  const handleAbrirModalAjuste = (material) => {
    console.log('Abriendo modal de ajuste para material:', material);
    setMaterialSeleccionado(material);
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
    if (formData.item) {
      handleBuscar();
    }
  };

  // Renderizado condicional si no hay usuario
  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Materiales">
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
            Consulta de Materiales
          </Typography>
                     <Typography 
             variant="body2" 
             sx={{ 
               color: 'var(--color-text-secondary)',
               mb: isMobile ? 1 : 3
             }}
           >
             Busca materiales por item para ver las posiciones donde se encuentra el stock disponible
           </Typography>
        </Box>

        {/* Formulario de búsqueda */}
                 <ModernCard
           title="Búsqueda por Material"
           subtitle="Selecciona un item para consultar las posiciones donde se encuentra"
           sx={{ mb: isMobile ? 2 : 4 }}
           padding={isMobile ? "compact" : "normal"}
         >
          <LoadingInfo loading={loading} error={error}>
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: isMobile ? 1 : 2,
              alignItems: 'flex-end',
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
              {/* Selector de Proveedor */}
              <Box sx={{ 
                flex: '1 1 200px',
                minWidth: '150px',
                maxWidth: '200px'
              }}>
                                 <AutocompleteSelect
                   label="Proveedor"
                   placeholder="Selecciona un proveedor..."
                   options={proveedores}
                   value={formData.proveedor}
                   onChange={(value) => handleInputChange('proveedor', value)}
                   getOptionLabel={(option) => option.nombre}
                   getOptionKey={(option) => `proveedor-${option.id || option.nombre}`}
                   filterOptions={filterProveedores}
                   isOptionEqualToValue={(option, value) => {
                     if (!value) return false;
                     if (typeof value === 'string') {
                       return option.nombre === value;
                     }
                     return option.id === value.id;
                   }}
                 />
              </Box>

              {/* Selector de Item */}
              <Box sx={{ 
                flex: '1 1 300px',
                minWidth: '200px',
                maxWidth: '300px'
              }}>
                                 <AutocompleteSelect
                   label="Item"
                   placeholder="Selecciona un item..."
                   options={itemsFiltrados}
                   value={formData.item}
                   onChange={(value) => handleInputChange('item', value)}
                   getOptionLabel={(option) => `${option.categoria} - ${option.descripcion}`}
                   getOptionKey={(option) => `item-${option.id || option.categoria}-${option.descripcion}`}
                   filterOptions={filterItems}
                   disabled={!formData.proveedor}
                   isOptionEqualToValue={(option, value) => {
                     if (!value) return false;
                     return option.id === value.id;
                   }}
                 />
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
                  disabled={buscando || !formData.item}
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
          </LoadingInfo>
        </ModernCard>

        {/* Resultados */}
        {resultados.length > 0 && (
          <ModernCard
            title={`Resultados (${resultados.length} posiciones)`}
            subtitle={`Stock disponible para ${formData.item?.categoria} - ${formData.item?.descripcion}`}
            padding={isMobile ? "compact" : "normal"}
          >
                         <Box sx={{ mt: 2 }}>
               <Box sx={{ 
                 display: 'flex', 
                 flexDirection: 'row', 
                 flexWrap: 'wrap', 
                 gap: isMobile ? 1 : 2,
                 overflowX: 'auto',
                 pb: 1
               }}>
                 {resultados.map((resultado, index) => (
                   <Box 
                     key={index}
                     sx={{
                       minWidth: isMobile ? '280px' : '320px',
                       flex: '0 0 auto',
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
                     onClick={() => handlePosicionClick(resultado)}
                   >
                     <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                       <LocationIcon sx={{ 
                         fontSize: 20, 
                         color: 'var(--color-primary)', 
                         mr: 1 
                       }} />
                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                         {(() => {
                           const pos = resultado.posicion;
                           if (pos?.rack && pos?.fila && pos?.AB) {
                             return `${pos.rack}-${pos.fila}-${pos.AB}`;
                           } else if (pos?.numeroPasillo) {
                             return `Pasillo ${pos.numeroPasillo}`;
                           } else if (pos?.entrada === true) {
                             return 'Entrada';
                           } else {
                             return 'Posición no especificada';
                           }
                         })()}
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
                     
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                       <Typography variant="body2" color="text.secondary">
                         Unidades:
                       </Typography>
                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
                         {resultado.unidades} un
                       </Typography>
                       </Box>
                     
                     {/* Botones de acción */}
                     <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                       <Button
                         variant="outlined"
                         size="small"
                         startIcon={<EditIcon />}
                         onClick={(e) => {
                           e.stopPropagation(); // Evitar que se active el click de la carta
                           handleAbrirModalAjuste(resultado);
                         }}
                         sx={{
                           borderColor: 'var(--color-primary)',
                           color: 'var(--color-primary)',
                           '&:hover': {
                             borderColor: 'var(--color-primary-dark)',
                             backgroundColor: 'var(--color-primary-light)'
                           }
                         }}
                       >
                         Ajustar Stock
                       </Button>
                       
                       <Button
                         variant="contained"
                         size="small"
                         startIcon={<LocationIcon />}
                         sx={{
                           backgroundColor: 'var(--color-secondary)',
                           '&:hover': {
                             backgroundColor: 'var(--color-secondary-dark)'
                           }
                         }}
                       >
                         Ver Posición
                       </Button>
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

        {/* Modal de ajuste de material */}
        <AjusteMaterialModal
          open={modalAjusteOpen}
          onClose={handleCerrarModalAjuste}
          material={materialSeleccionado}
          onAjusteExitoso={handleAjusteExitoso}
        />
      </Box>
    </AppLayout>
  );
};
