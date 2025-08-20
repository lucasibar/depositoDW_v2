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
  Inventory as InventoryIcon
} from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import AutocompleteSelect from '../../shared/ui/AutocompleteSelect/AutocompleteSelect';
import LoadingInfo from '../../shared/ui/LoadingInfo/LoadingInfo';
import { 
  cargarDatosIniciales,
  buscarMaterialesPorProveedorItem,
  buscarMaterialesPorItemId
} from '../../features/adicionesRapidas/model/thunks';
import { 
  selectProveedores, 
  selectItems, 
  selectAdicionesRapidasLoading, 
  selectAdicionesRapidasError 
} from '../../features/adicionesRapidas/model/selectors';
import { useAdicionRapida } from '../../features/adicionesRapidas/hooks/useAdicionRapida';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { useNavigate } from 'react-router-dom';

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

  // Redux state
  const proveedores = useSelector(selectProveedores);
  const items = useSelector(selectItems);
  const loading = useSelector(selectAdicionesRapidasLoading);
  const error = useSelector(selectAdicionesRapidasError);

  // Hook personalizado para filtrado
  const { itemsFiltrados, filterProveedores, filterItems } = useAdicionRapida(
    proveedores, 
    items, 
    formData.proveedor
  );

  // Debug logs
  console.log('Debug MaterialesPage:', {
    proveedores: proveedores?.length,
    items: items?.length,
    formDataProveedor: formData.proveedor,
    itemsFiltrados: itemsFiltrados?.length,
    formDataItem: formData.item
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

  // Handlers de navegación
  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  // Handlers del formulario
  const handleInputChange = (field, value) => {
    console.log(`handleInputChange - field: ${field}, value:`, value);
    
    if (field === 'proveedor') {
      // Para proveedor, guardar solo el nombre como string
      const proveedorNombre = value?.nombre || value || '';
      console.log('Proveedor seleccionado:', proveedorNombre);
      
      setFormData(prev => ({
        ...prev,
        proveedor: proveedorNombre,
        item: null // Limpiar item cuando cambia proveedor
      }));
    } else if (field === 'item') {
      // Para item, guardar el objeto completo
      console.log('Item seleccionado:', value);
      
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
      console.log('Buscando item por ID:', formData.item.id);
      
      const resultado = await dispatch(buscarMaterialesPorItemId({
        itemId: formData.item.id
      })).unwrap();
      
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

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
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
              alignItems: 'flex-end'
            }}>
              {/* Selector de Proveedor */}
              <Box sx={{ 
                flex: '1 1 200px',
                minWidth: '200px'
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
                minWidth: '250px'
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
                         {resultado.posicion}
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
