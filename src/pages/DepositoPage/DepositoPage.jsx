import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { AdvancedFilters } from '../../shared/ui/AdvancedFilters/AdvancedFilters';
import { PosicionList } from '../../widgets/PosicionList/PosicionList';

import { MovimientoInternoForm } from '../../widgets/remitos/MovimientoInternoForm/MovimientoInternoForm';
import { CorreccionForm } from '../../widgets/remitos/CorreccionForm/CorreccionForm';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { usePosicionesCache } from '../../features/stock/hooks/usePosicionesCache';
import { useOptimizedMovements } from '../../features/stock/hooks/useOptimizedMovements';
import { applyAllFilters } from '../../features/stock/utils/posicionUtils';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { SEARCH_PLACEHOLDERS } from '../../features/stock/constants/stockConstants';

export const DepositoPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados del usuario y autenticación
  const [user, setUser] = useState(null);
  
  // Estados de filtros y búsqueda
  const [filteredPosiciones, setFilteredPosiciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    rack: '',
    fila: '',
    ab: '',
    pasillo: ''
  });
  
  // Estados de formularios
  const [movimientoInternoOpen, setMovimientoInternoOpen] = useState(false);
  const [correccionOpen, setCorreccionOpen] = useState(false);
  const [selectedPosicion, setSelectedPosicion] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Hooks optimizados
  const { posiciones, isLoading, error, fetchPosiciones } = usePosicionesCache();
  const { 
    executeMovimientoInterno, 
    executeAjusteStock,
    notification,
    closeNotification
  } = useOptimizedMovements();

  // Inicialización y autenticación
  useEffect(() => {
    const currentUser = checkAuthentication(navigate);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate]);

  // Aplicar filtros cuando cambien las posiciones o filtros
  useEffect(() => {
    const filtered = applyAllFilters(posiciones, searchTerm, advancedFilters);
    setFilteredPosiciones(filtered);
  }, [posiciones, searchTerm, advancedFilters]);

  // Handler para cargar posiciones manualmente
  const handleCargarPosiciones = () => {
    fetchPosiciones();
  };

  // Handlers de navegación
  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  // Handlers de búsqueda y filtros
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleAdvancedFiltersChange = (newFilters) => {
    setAdvancedFilters(newFilters);
  };

  // Handlers de posiciones
  const handlePosicionClick = (posicion) => {
    console.log("Posición seleccionada:", posicion);
  };

  // Handlers de formularios
  const handleMovimientoInterno = (item, posicion) => {
    if (item && posicion) {
      setSelectedItem(item);
      setSelectedPosicion(posicion);
      setMovimientoInternoOpen(true);
    }
  };

  const handleCorreccion = (item, posicion) => {
    setSelectedItem(item);
    setSelectedPosicion(posicion);
    setCorreccionOpen(true);
  };

  // Handlers de envío de formularios
  const handleMovimientoInternoSubmit = async (data) => {
    try {
      const result = await executeMovimientoInterno(data);
      if (result.success) {
        setMovimientoInternoOpen(false);
        setSelectedItem(null);
        setSelectedPosicion(null);
      }
    } catch (error) {
      console.error('Error en movimiento interno:', error);
    }
  };

  const handleCorreccionSubmit = async (data) => {
    try {
      const result = await executeAjusteStock(data);
      if (result.success) {
        setCorreccionOpen(false);
        setSelectedItem(null);
        setSelectedPosicion(null);
      }
    } catch (error) {
      console.error('Error en corrección:', error);
    }
  };

  // Renderizado condicional si no hay usuario
  if (!user) {
    return null;
  }

  // Renderizado de loading
  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Depósito">
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

  // Renderizado de error
  if (error) {
    return (
      <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Depósito">
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
              onClick={() => window.location.reload()}
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
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Depósito">
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
              Depósito
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                mb: 3
              }}
            >
              {filteredPosiciones.length} de {posiciones.length} posiciones
            </Typography>
          </Box>
        )}

        {/* Filtros compactos */}
        <ModernCard
          title={isMobile ? "Filtros" : "Búsqueda y Filtros"}
          subtitle={isMobile ? "" : "Encuentra rápidamente las posiciones que necesitas"}
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
            {/* Barra de búsqueda */}
            <Box sx={{ 
              flex: isMobile || isTablet ? '0 0 50%' : '1',
              minWidth: 0
            }}>
              <SearchBar 
                placeholder={SEARCH_PLACEHOLDERS.DEPOSITO}
                onSearch={handleSearch}
              />
            </Box>
            
            {/* Filtros avanzados */}
            <Box sx={{ 
              flex: isMobile || isTablet ? '0 0 25%' : '0 0 auto',
              minWidth: isMobile ? '120px' : isTablet ? '140px' : '220px'
            }}>
              <AdvancedFilters 
                filters={advancedFilters}
                onFilterChange={handleAdvancedFiltersChange}
              />
            </Box>

            {/* Botón de cargar posiciones */}
            <Box sx={{ 
              flex: isMobile || isTablet ? '0 0 25%' : '0 0 auto',
              minWidth: isMobile ? '120px' : isTablet ? '140px' : '180px'
            }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCargarPosiciones}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <InventoryIcon />}
                sx={{ 
                  width: '100%',
                  height: 56
                }}
              >
                {isLoading ? 'Cargando...' : 'Cargar Posiciones'}
              </Button>
            </Box>
          </Box>
        </ModernCard>
        
        {/* Lista de Posiciones */}
        <ModernCard
          title={isMobile ? undefined : `Posiciones (${filteredPosiciones.length})`}
          subtitle={isMobile ? undefined : `Mostrando ${filteredPosiciones.length} de ${posiciones.length} posiciones`}
          headerAction={
            !isMobile ? (
              <Chip 
                label={`${posiciones.length} total`}
                color="primary"
                size="small"
              />
            ) : undefined
          }
          padding={isMobile ? "compact" : "normal"}
        >
          <PosicionList
            posiciones={filteredPosiciones}
            onPosicionClick={handlePosicionClick}
            onMovimientoInterno={handleMovimientoInterno}
            onCorreccion={handleCorreccion}
            searchTerm={searchTerm}
          />
        </ModernCard>
        
        {/* Formularios */}
        <MovimientoInternoForm
          open={movimientoInternoOpen}
          onClose={() => {
            setMovimientoInternoOpen(false);
            setSelectedItem(null);
            setSelectedPosicion(null);
          }}
          item={selectedItem}
          posicionOrigen={selectedPosicion}
          onSubmit={handleMovimientoInternoSubmit}
        />
        
        <CorreccionForm
          open={correccionOpen}
          onClose={() => {
            setCorreccionOpen(false);
            setSelectedItem(null);
            setSelectedPosicion(null);
          }}
          item={selectedItem}
          posicion={selectedPosicion}
          onSubmit={handleCorreccionSubmit}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={closeNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </AppLayout>
  );
}; 