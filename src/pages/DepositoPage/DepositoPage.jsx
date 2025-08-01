import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  AppBar, 
  Toolbar,
  Container
} from '@mui/material';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { AdvancedFilters } from '../../shared/ui/AdvancedFilters/AdvancedFilters';
import { PosicionList } from '../../widgets/PosicionList/PosicionList';
import { AdicionRapidaForm } from '../../widgets/remitos/AdicionRapidaForm/AdicionRapidaForm';
import { MovimientoInternoForm } from '../../widgets/remitos/MovimientoInternoForm/MovimientoInternoForm';
import { CorreccionForm } from '../../widgets/remitos/CorreccionForm/CorreccionForm';
import { fetchPosicionesConItems, adicionRapida, movimientoInterno, correccionItem } from '../../features/stock/model/slice';
import { selectPosiciones, selectStockLoading, selectStockError } from '../../features/stock/model/selectors';
import { applyAllFilters } from '../../features/stock/utils/posicionUtils';
import { getRoleColor, getRoleLabel } from '../../features/stock/utils/userUtils';
import { checkAuthentication, handleLogout } from '../../features/stock/utils/navigationUtils';
import { SEARCH_PLACEHOLDERS, ERROR_MESSAGES } from '../../features/stock/constants/stockConstants';
import styles from './DepositoPage.module.css';

export const DepositoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    // Aquí puedes agregar lógica específica para depósito
    // Por ejemplo, abrir un modal con detalles o navegar a otra página
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
    console.log('Datos recibidos para corrección:', { item, posicion });
    if (item && posicion) {
      setSelectedItem(item);
      setSelectedPosicion(posicion);
      setCorreccionOpen(true);
    } else {
      console.error('Datos inválidos para corrección:', { item, posicion });
    }
  };

  const handleAdicionRapidaSubmit = async (data) => {
    try {
      await dispatch(adicionRapida(data));
      dispatch(fetchPosicionesConItems()); // Recargar posiciones
    } catch (error) {
      console.error('Error en adición rápida:', error);
    }
  };

  const handleMovimientoInternoSubmit = async (data) => {
    try {
      await dispatch(movimientoInterno(data));
      dispatch(fetchPosicionesConItems()); // Recargar posiciones
    } catch (error) {
      console.error('Error en movimiento interno:', error);
    }
  };

  const handleCorreccionSubmit = async (data) => {
    try {
      await dispatch(correccionItem(data));
      dispatch(fetchPosicionesConItems()); // Recargar posiciones
    } catch (error) {
      console.error('Error en corrección:', error);
    }
  };



  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{ERROR_MESSAGES.LOADING_POSICIONES}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchPosicionesConItems())} className={styles.retryButton}>
          {ERROR_MESSAGES.RETRY}
        </button>
      </div>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Der Will - Sistema de Gestión
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Bienvenido, {user.name}
            </Typography>
            <Chip 
              label={getRoleLabel(user.role)} 
              color={getRoleColor(user.role)}
              size="small"
            />
            {user.role === 'admin' && (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/deposito_dw_front/compras')}
                  sx={{ 
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Compras
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/deposito_dw_front/calidad')}
                  sx={{ 
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Calidad
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/deposito_dw_front/admin')}
                  sx={{ 
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Admin
                </Button>
              </>
            )}
            <Button 
              color="inherit" 
              onClick={handleLogoutClick}
              sx={{ 
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <div className={styles.container}>
          <Typography variant="h4" gutterBottom>
            Panel de Control - Depósito
          </Typography>
          
          <div className={styles.header}>
            <div className={styles.searchSection}>
              <SearchBar 
                placeholder={SEARCH_PLACEHOLDERS.DEPOSITO}
                onSearch={handleSearch}
              />
            </div>
            <div className={styles.filtersSection}>
              <AdvancedFilters 
                filters={advancedFilters}
                onFilterChange={handleAdvancedFiltersChange}
              />
            </div>
          </div>
          
          <PosicionList
            posiciones={filteredPosiciones}
            onPosicionClick={handlePosicionClick}
            onAdicionRapida={handleAdicionRapida}
            onMovimientoInterno={handleMovimientoInterno}
            onCorreccion={handleCorreccion}
          />
          
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
        </div>
      </Container>
    </Box>
  );
}; 