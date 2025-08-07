import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Container,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { AdvancedFilters } from '../../shared/ui/AdvancedFilters/AdvancedFilters';
import { PosicionList } from '../../widgets/PosicionList/PosicionList';
import { AdicionRapidaForm } from '../../widgets/remitos/AdicionRapidaForm/AdicionRapidaForm';
import { MovimientoInternoForm } from '../../widgets/remitos/MovimientoInternoForm/MovimientoInternoForm';
import { CorreccionForm } from '../../widgets/remitos/CorreccionForm/CorreccionForm';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { fetchPosicionesConItems, adicionRapida, movimientoInterno } from '../../features/stock/model/slice';
import { selectPosiciones, selectStockLoading, selectStockError } from '../../features/stock/model/selectors';
import { applyAllFilters } from '../../features/stock/utils/posicionUtils';
import { getRoleColor, getRoleLabel } from '../../features/stock/utils/userUtils';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { SEARCH_PLACEHOLDERS, ERROR_MESSAGES } from '../../features/stock/constants/stockConstants';

export const DepositoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [user, setUser] = useState(null);
  const [filteredPosiciones, setFilteredPosiciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    rack: '',
    fila: '',
    ab: '',
    pasillo: ''
  });
  
  // Estados para los formularios
  const [adicionRapidaOpen, setAdicionRapidaOpen] = useState(false);
  const [movimientoInternoOpen, setMovimientoInternoOpen] = useState(false);
  const [correccionOpen, setCorreccionOpen] = useState(false);
  const [selectedPosicion, setSelectedPosicion] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const posiciones = useSelector(selectPosiciones);
  const isLoading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);

  useEffect(() => {
    const currentUser = checkAuthentication(navigate);
    if (currentUser) {
      setUser(currentUser);
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchPosicionesConItems());
  }, [dispatch]);

  useEffect(() => {
    const filtered = applyAllFilters(posiciones, searchTerm, advancedFilters);
    setFilteredPosiciones(filtered);
  }, [posiciones, searchTerm, advancedFilters]);

  const handleLogoutClick = () => {
    handleLogout(navigate);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleAdvancedFiltersChange = (newFilters) => {
    setAdvancedFilters(newFilters);
  };

  const handlePosicionClick = (posicion) => {
    console.log("Posición seleccionada:", posicion);
  };

  const handleAdicionRapida = (posicion) => {
    setSelectedPosicion(posicion);
    setAdicionRapidaOpen(true);
  };

  const handleMovimientoInterno = (item, posicion) => {
    console.log('Datos recibidos para movimiento interno:', { item, posicion });
    if (item && posicion) {
      setSelectedItem(item);
      setSelectedPosicion(posicion);
      setMovimientoInternoOpen(true);
    } else {
      console.error('Datos inválidos para movimiento interno:', { item, posicion });
    }
  };

  const handleCorreccion = (item, posicion) => {
    setSelectedItem(item);
    setSelectedPosicion(posicion);
    setCorreccionOpen(true);
  };

  const handleAdicionRapidaSubmit = async (data) => {
    try {
      await dispatch(adicionRapida(data)).unwrap();
      setAdicionRapidaOpen(false);
      setSelectedPosicion(null);
    } catch (error) {
      console.error('Error en adición rápida:', error);
    }
  };

  const handleMovimientoInternoSubmit = async (data) => {
    try {
      await dispatch(movimientoInterno(data)).unwrap();
      setMovimientoInternoOpen(false);
      setSelectedItem(null);
      setSelectedPosicion(null);
    } catch (error) {
      console.error('Error en movimiento interno:', error);
    }
  };

  const handleCorreccionSubmit = async (data) => {
    try {
      // Implementar lógica de corrección
      setCorreccionOpen(false);
      setSelectedItem(null);
      setSelectedPosicion(null);
    } catch (error) {
      console.error('Error en corrección:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={handleLogoutClick}>
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
      <AppLayout user={user} onLogout={handleLogoutClick}>
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
    <AppLayout user={user} onLogout={handleLogoutClick}>
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header compacto */}
        <Box sx={{ mb: isMobile ? 2 : 4 }}>
          <Typography 
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} 
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
              mb: isMobile ? 1 : 3
            }}
          >
            {filteredPosiciones.length} de {posiciones.length} posiciones
          </Typography>
        </Box>

        {/* Filtros compactos */}
        <ModernCard
          title={isMobile ? "Filtros" : "Búsqueda y Filtros"}
          subtitle={isMobile ? "" : "Encuentra rápidamente las posiciones que necesitas"}
          sx={{ mb: isMobile ? 2 : 4 }}
          padding={isMobile ? "compact" : "normal"}
        >
          {/* Layout en una línea para todos los dispositivos */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row',
            gap: isMobile ? 0.5 : isTablet ? 1 : 2,
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            {/* Barra de búsqueda - 2/3 del espacio en móvil/tablet */}
            <Box sx={{ 
              flex: isMobile || isTablet ? '0 0 66.666%' : '1',
              minWidth: 0
            }}>
              <SearchBar 
                placeholder={SEARCH_PLACEHOLDERS.DEPOSITO}
                onSearch={handleSearch}
              />
            </Box>
            
            {/* Filtros avanzados - 1/3 del espacio en móvil/tablet */}
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
        
        {/* Lista de Posiciones - Sin título en móvil para ahorrar espacio */}
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
            onAdicionRapida={handleAdicionRapida}
            onMovimientoInterno={handleMovimientoInterno}
            onCorreccion={handleCorreccion}
            searchTerm={searchTerm}
          />
        </ModernCard>
        
        {/* Formularios */}
        <AdicionRapidaForm
          open={adicionRapidaOpen}
          onClose={() => setAdicionRapidaOpen(false)}
          posicion={selectedPosicion}
          onSubmit={handleAdicionRapidaSubmit}
        />
        
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
      </Container>
    </AppLayout>
  );
}; 