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
  Button
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { AdvancedFilters } from '../../shared/ui/AdvancedFilters/AdvancedFilters';
import AppHeader from '../../shared/ui/AppHeader';
import { SalidaTabs, SalidaCard, EmptyState, SalidaForm, StockCard, RemitosSalidaList, RemitoSalidaModal } from '../../features/salida/ui';
import { useSalidaActions } from '../../features/salida/hooks';
import { EMPTY_STATE_MESSAGES } from '../../features/salida/constants/salidaConstants';
import { generatePosicionTitle } from '../../features/stock/utils/posicionUtils';
import { fetchPosicionesConItems } from '../../features/stock/model/slice';
import { selectPosiciones, selectStockLoading, selectStockError } from '../../features/stock/model/selectors';
import { fetchHistorialSalida, deleteItemFromRemito } from '../../features/salida/model/historialSlice';
import styles from './SalidaPage.module.css';
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
  const { user } = useAuth();
  const { posiciones, isLoading, error } = useSelector((state) => state.stock);
  const { historialSalida = [], loading: loadingHistorial, error: errorHistorial } = useSelector((state) => state.historial) || {};
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    rack: '',
    fila: '',
    ab: '',
    pasillo: ''
  });
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPosicion, setSelectedPosicion] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filteredPosiciones, setFilteredPosiciones] = useState([]);

  // Hook para acciones de salida
  const { loading: loadingActions, snackbar, handleCrearSalida, handleAprobarSalida, handleRechazarSalida, handleCompletarSalida, handleCloseSnackbar } = useSalidaActions();

  // Cargar posiciones con items usando Redux
  useEffect(() => {
    dispatch(fetchPosicionesConItems());
  }, [dispatch]);

  // Cargar historial de salidas
  useEffect(() => {
    dispatch(fetchHistorialSalida());
  }, [dispatch]);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    const filtered = filterPosicionesForSalida(posiciones, searchTerm, advancedFilters);
    setFilteredPosiciones(filtered);
  }, [posiciones, searchTerm, advancedFilters]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAdvancedFiltersChange = (newFilters) => {
    setAdvancedFilters(newFilters);
  };

  // Handlers para PosicionCard (replicando la lógica de Depósito)
  const handlePosicionClick = (posicion) => {
    console.log("Posición seleccionada:", posicion);
  };

  const handleAdicionRapida = (posicion) => {
    // En Salida, este botón no se usa, pero mantenemos la estructura
    console.log("Adición rápida no disponible en Salida");
  };

  const handleMovimientoInterno = (item, posicion) => {
    // En Salida, este es el botón para agregar al remito
    console.log('Agregando al remito:', { item, posicion });
    setSelectedItem(item);
    setSelectedPosicion(posicion);
    setFormOpen(true);
  };

  const handleCorreccion = (item, posicion) => {
    // En Salida, este botón no se usa, pero mantenemos la estructura
    console.log("Corrección no disponible en Salida");
  };

  const handleSubmitRemito = async (remitoData) => {
    try {
      console.log('Datos del remito:', remitoData);
      
      // Validar que tenemos todos los datos necesarios
      if (!remitoData.selectedItem || !remitoData.id) {
        console.error('Faltan datos del item o posición seleccionada');
        setMessage({ type: 'error', text: 'Faltan datos del item o posición seleccionada' });
        return;
      }
      
      console.log('URL del endpoint:', `${API_CONFIG.BASE_URL}/movimientos/salida-desde-posicion`);
      console.log('Datos enviados al backend:', remitoData);

      const response = await fetch(`${API_CONFIG.BASE_URL}/movimientos/salida-desde-posicion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(remitoData)
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const responseData = await response.text();
        console.log('Respuesta completa del servidor:', responseData);
        
        // Recargar datos
        dispatch(fetchPosicionesConItems());
        dispatch(fetchHistorialSalida());
        setFormOpen(false);
        setSelectedItem(null);
        setSelectedPosicion(null);
        
        setMessage({ type: 'success', text: 'Remito de salida creado exitosamente' });
        console.log('Remito de salida creado exitosamente');
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData);
        setMessage({ type: 'error', text: `Error al generar remito: ${response.status} ${response.statusText}` });
        throw new Error(`Error al generar remito: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al generar remito:', error);
      setMessage({ type: 'error', text: `Error al generar remito: ${error.message}` });
    }
  };

  const handleDeleteItem = async (remitoKey, itemId) => {
    try {
      // Encontrar el remito por su key
      const remito = historialSalida?.find(r => `${r.fecha}-${r.proveedor}` === remitoKey);
      
      if (remito) {
        await dispatch(deleteItemFromRemito({ 
          remitoId: remito.id, 
          itemId: itemId 
        })).unwrap();
        
        // Mostrar mensaje de éxito
        console.log('Item eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando posiciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchPosicionesConItems())} className={styles.retryButton}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader user={user} />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <div className={styles.container}>
          <Typography variant="h4" gutterBottom>
            Panel de Control - Salida
          </Typography>
          
          {/* Mensajes de éxito o error */}
          {message.text && (
            <Box 
              sx={{ 
                mb: 2, 
                p: 2, 
                borderRadius: 1,
                backgroundColor: message.type === 'success' ? 'success.light' : 'error.light',
                color: message.type === 'success' ? 'success.dark' : 'error.dark'
              }}
            >
              <Typography variant="body1">
                {message.text}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ width: '100%', mt: 3 }}>
            <SalidaTabs 
              tabValue={tabValue}
              onTabChange={handleTabChange}
              salidasPendientesCount={0} // TODO: Implementar contador real
              salidasAprobadasCount={0} // TODO: Implementar contador real
              remitosCount={historialSalida.length}
            />
            
            {/* Contenido de las pestañas */}
            <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
              {tabValue === 0 ? (
                // Pestaña de Remito Salida (PRINCIPAL) - Panel de Control
                <div>
                  <Typography variant="h6" gutterBottom>
                    Stock Disponible por Posición
                  </Typography>
                  
                  {/* Header con búsqueda y filtros para Remito Salida */}
                  <div className={styles.header}>
                    <div className={styles.searchSection}>
                      <SearchBar 
                        placeholder="Buscar por posición, material, categoría o proveedor..."
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
                  
                  {filteredPosiciones.length === 0 ? (
                    <EmptyState 
                      icon={ReceiptIcon}
                      title="No hay stock disponible"
                      description="No se encontraron posiciones con stock disponible"
                      searchTerm={searchTerm}
                    />
                  ) : (
                    <div className={styles.posicionList}>
                      {filteredPosiciones.map((posicion, index) => {
                        const uniqueKey = posicion.posicionId || `posicion-${index}`;
                        
                        return (
                          <StockCard
                            key={uniqueKey}
                            posicion={posicion}
                            onClick={handlePosicionClick}
                            onAdicionRapida={handleAdicionRapida}
                            onMovimientoInterno={handleMovimientoInterno}
                            onCorreccion={handleCorreccion}
                            searchTerm={searchTerm}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : tabValue === 1 ? (
                // Pestaña de Salidas Pendientes (por ahora vacía)
                <div>
                  <Typography variant="h6" gutterBottom>
                    Salidas Pendientes
                  </Typography>
                  
                  <EmptyState 
                    icon={ExitToAppIcon}
                    {...EMPTY_STATE_MESSAGES.PENDIENTES}
                    searchTerm=""
                  />
                </div>
              ) : (
                // Pestaña de Historial
                <div>
                  <RemitosSalidaList 
                    remitos={historialSalida}
                    loading={loadingHistorial}
                    error={errorHistorial}
                    onDeleteItem={handleDeleteItem}
                  />
                </div>
              )}
            </Paper>
          </Box>

          {/* Formulario de Remito */}
          <RemitoSalidaModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleSubmitRemito}
            item={selectedItem}
            posicionId={selectedPosicion?.posicionId}
          />

          {/* Snackbar para notificaciones */}
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
        </div>
      </Container>
    </Box>
  );
}; 