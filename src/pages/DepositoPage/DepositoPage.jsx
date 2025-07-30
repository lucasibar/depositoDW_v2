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
import { fetchPosicionesConItems } from '../../features/stock/model/slice';
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
          />
        </div>
      </Container>
    </Box>
  );
}; 