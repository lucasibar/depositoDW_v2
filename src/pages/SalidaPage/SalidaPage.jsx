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
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { AdvancedFilters } from '../../shared/ui/AdvancedFilters/AdvancedFilters';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { SalidaTabs, SalidaCard, EmptyState, SalidaForm, StockCard, RemitosSalidaList, RemitoSalidaModal } from '../../features/salida/ui';
import { useSalidaActions } from '../../features/salida/hooks';
import { EMPTY_STATE_MESSAGES } from '../../features/salida/constants/salidaConstants';
import { generatePosicionTitle } from '../../features/stock/utils/posicionUtils';
import { fetchPosicionesConItems } from '../../features/stock/model/slice';
import { selectPosiciones, selectStockLoading, selectStockError } from '../../features/stock/model/selectors';
import { fetchHistorialSalida, deleteItemFromRemito } from '../../features/salida/model/historialSlice';
import { API_CONFIG } from '../../config/api';

// Función de filtrado específica para Salida
const filterPosicionesForSalida = (posiciones, searchTerm, advancedFilters) => {
  let filtered = posiciones;
  
  // Aplicar filtro de búsqueda
  if (searchTerm.trim()) {
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    
    filtered = filtered
      .map(posicion => {
        if (!posicion || !posicion.items) return null;
        
        // Filtrar items dentro de la posición
        const filteredItems = posicion.items.filter(item => {
          if (!item) return false;
          
          const searchableText = [
            item.categoria || '',
            item.descripcion || '',
            item.partida || '',
            item.proveedor?.nombre || ''
          ].join(' ').toLowerCase();
          
          return searchWords.every(word => searchableText.includes(word));
        });
        
        // Solo incluir la posición si tiene items que coincidan
        if (filteredItems.length > 0) {
          return {
            ...posicion,
            items: filteredItems
          };
        }
        return null;
      })
      .filter(posicion => posicion !== null); // Remover posiciones sin items que coincidan
  }
  
  // Aplicar filtros avanzados
  if (Object.values(advancedFilters).some(filter => filter !== '')) {
    filtered = filtered.filter(posicion => {
      // Filtrar por rack (comparar como string)
      if (advancedFilters.rack && posicion.rack !== advancedFilters.rack) {
        return false;
      }
      
      // Filtrar por fila (comparar como string)
      if (advancedFilters.fila && posicion.fila !== advancedFilters.fila) {
        return false;
      }
      
      // Filtrar por AB (comparar como string)
      if (advancedFilters.ab && posicion.AB !== advancedFilters.ab) {
        return false;
      }
      
      // Filtrar por pasillo (comparar como string)
      if (advancedFilters.pasillo && posicion.pasillo !== advancedFilters.pasillo) {
        return false;
      }
      
      return true;
    });
  }
  
  return filtered;
};

export const SalidaPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useAuth();
  const [filteredPosiciones, setFilteredPosiciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    rack: '',
    fila: '',
    ab: '',
    pasillo: ''
  });
  
  // Estados para los formularios
  const [salidaFormOpen, setSalidaFormOpen] = useState(false);
  const [selectedPosicion, setSelectedPosicion] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [remitoModalOpen, setRemitoModalOpen] = useState(false);
  
  const posiciones = useSelector(selectPosiciones);
  const isLoading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);
  const historialSalida = useSelector(state => state.historial?.historialSalida || []);

  const {
    loading: salidaLoading,
    snackbar,
    handleSubmitSalida,
    handleCloseSnackbar
  } = useSalidaActions();

  useEffect(() => {
    dispatch(fetchPosicionesConItems());
    dispatch(fetchHistorialSalida());
  }, [dispatch]);

  useEffect(() => {
    const filtered = filterPosicionesForSalida(posiciones, searchTerm, advancedFilters);
    setFilteredPosiciones(filtered);
  }, [posiciones, searchTerm, advancedFilters]);

  const handleTabChange = (event, newValue) => {
    // Implementar lógica de cambio de tab si es necesario
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAdvancedFiltersChange = (newFilters) => {
    setAdvancedFilters(newFilters);
  };

  const handlePosicionClick = (posicion) => {
    console.log("Posición seleccionada:", posicion);
  };



  const handleMovimientoInterno = (item, posicion) => {
    console.log('Datos recibidos para movimiento interno:', { item, posicion });
    if (item && posicion) {
      setSelectedItem(item);
      setSelectedPosicion(posicion);
      setSalidaFormOpen(true);
    } else {
      console.error('Datos inválidos para movimiento interno:', { item, posicion });
    }
  };

  const handleCorreccion = (item, posicion) => {
    setSelectedItem(item);
    setSelectedPosicion(posicion);
    setSalidaFormOpen(true);
  };

  const handleSubmitRemito = async (remitoData) => {
    try {
      await handleSubmitSalida(remitoData);
      setRemitoModalOpen(false);
    } catch (error) {
      console.error('Error al crear remito de salida:', error);
    }
  };

  const handleDeleteItem = async (remitoKey, itemId) => {
    try {
      await dispatch(deleteItemFromRemito({ remitoKey, itemId })).unwrap();
    } catch (error) {
      console.error('Error al eliminar item del remito:', error);
    }
  };

  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Salida">
        <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '60vh'
          }}>
            <Typography variant="h6" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
              Cargando posiciones...
            </Typography>
          </Box>
        </Container>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Salida">
        <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
          <ModernCard
            title="Error"
            subtitle="No se pudieron cargar las posiciones"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            <Typography color="error" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => dispatch(fetchPosicionesConItems())}
              sx={{ backgroundColor: 'var(--color-primary)' }}
            >
              Reintentar
            </Button>
          </ModernCard>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Salida">
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header solo en desktop */}
        {!isMobile && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                mb: 0.5
              }}
            >
              Salida
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                mb: 3
              }}
            >
              Gestión de salidas de materiales y remitos
            </Typography>
          </Box>
        )}

        {/* Filtros */}
        <ModernCard
          title={isMobile ? "Filtros" : "Búsqueda y Filtros"}
          subtitle={isMobile ? "" : "Encuentra rápidamente los materiales para salida"}
          sx={{ mb: isMobile ? 2 : 4 }}
          padding={isMobile ? "compact" : "normal"}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row',
            gap: isMobile ? 0.5 : isTablet ? 1 : 2,
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              flex: isMobile || isTablet ? '0 0 66.666%' : '1',
              minWidth: 0
            }}>
              <SearchBar 
                placeholder="Buscar materiales por categoría, descripción, partida o proveedor..."
                onSearch={handleSearch}
              />
            </Box>
            
            <Box sx={{ 
              flex: isMobile || isTablet ? '0 0 33.333%' : '0 0 auto',
              minWidth: isMobile ? '120px' : isTablet ? '140px' : '220px'
            }}>
              <AdvancedFilters 
                filters={advancedFilters}
                onFilterChange={handleAdvancedFiltersChange}
              />
            </Box>
          </Box>
        </ModernCard>

        {/* Contenido principal */}
        <ModernCard
          title={isMobile ? undefined : "Gestión de Salidas"}
          subtitle={isMobile ? undefined : `Mostrando ${filteredPosiciones.length} posiciones con materiales`}
          padding={isMobile ? "compact" : "normal"}
        >
          <SalidaTabs 
            tabValue={0}
            onTabChange={handleTabChange}
            posicionesCount={filteredPosiciones.length}
            historialCount={historialSalida.length}
          />
          
          {/* Tab de Stock */}
          <Box sx={{ mt: 2 }}>
            {filteredPosiciones.length === 0 ? (
              <EmptyState 
                icon={ExitToAppIcon}
                {...EMPTY_STATE_MESSAGES.STOCK}
                searchTerm={searchTerm}
              />
            ) : (
              <Grid container spacing={2}>
                {filteredPosiciones.map((posicion) => (
                  <Grid item xs={12} sm={6} md={4} key={posicion.id}>
                    <StockCard
                      posicion={posicion}
                      onPosicionClick={handlePosicionClick}
                      onMovimientoInterno={handleMovimientoInterno}
                      onCorreccion={handleCorreccion}
                      searchTerm={searchTerm}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </ModernCard>

        {/* Formularios */}
        <SalidaForm
          open={salidaFormOpen}
          onClose={() => setSalidaFormOpen(false)}
          posicion={selectedPosicion}
          item={selectedItem}
          onSubmit={handleSubmitSalida}
        />

        <RemitoSalidaModal
          open={remitoModalOpen}
          onClose={() => setRemitoModalOpen(false)}
          onSubmit={handleSubmitRemito}
        />

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