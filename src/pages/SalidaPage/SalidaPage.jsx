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
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import { AdvancedFilters } from '../../shared/ui/AdvancedFilters/AdvancedFilters';
import AppHeader from '../../shared/ui/AppHeader';
import { SalidaTabs, SalidaCard, EmptyState, SalidaForm, StockCard } from '../../features/salida/ui';
import { useSalidaActions } from '../../features/salida/hooks';
import { EMPTY_STATE_MESSAGES } from '../../features/salida/constants/salidaConstants';
import { generatePosicionTitle } from '../../features/stock/utils/posicionUtils';
import { fetchPosicionesConItems } from '../../features/stock/model/slice';
import { selectPosiciones, selectStockLoading, selectStockError } from '../../features/stock/model/selectors';
import styles from './SalidaPage.module.css';

// Función de filtrado específica para Salida
const filterPosicionesForSalida = (posiciones, searchTerm, advancedFilters) => {
  let filtered = posiciones;
  
  // Aplicar filtro de búsqueda
  if (searchTerm.trim()) {
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    
    filtered = filtered.filter(posicion => {
      // Crear un string con todos los campos de búsqueda
      const searchableText = [
        generatePosicionTitle(posicion),
        ...posicion.items?.map(item => [
          item.categoria || '',
          item.descripcion || '',
          item.partida || '',
          item.proveedor?.nombre || ''
        ].join(' ')) || []
      ].join(' ').toLowerCase();
      
      // Verificar si TODAS las palabras están presentes en el texto buscable
      return searchWords.every(word => searchableText.includes(word));
    });
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
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPosicion, setSelectedPosicion] = useState(null);
  const [filteredPosiciones, setFilteredPosiciones] = useState([]);
  const [historialSalidas, setHistorialSalidas] = useState([]);
  
  // Estados para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    rack: '',
    fila: '',
    ab: '',
    pasillo: ''
  });

  // Redux selectors
  const posiciones = useSelector(selectPosiciones);
  const isLoading = useSelector(selectStockLoading);
  const error = useSelector(selectStockError);

  const {
    snackbar,
    handleCloseSnackbar
  } = useSalidaActions();

  // Cargar usuario al montar el componente
  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Cargar posiciones con items usando Redux
  useEffect(() => {
    dispatch(fetchPosicionesConItems());
  }, [dispatch]);

  // Cargar historial de salidas
  useEffect(() => {
    fetchHistorialSalidas();
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    const filtered = filterPosicionesForSalida(posiciones, searchTerm, advancedFilters);
    setFilteredPosiciones(filtered);
  }, [posiciones, searchTerm, advancedFilters]);

  const fetchHistorialSalidas = async () => {
    try {
      // TODO: Implementar llamada a API real
      const response = await fetch('/api/movimientos/salidas');
      const data = await response.json();
      setHistorialSalidas(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      // Por ahora mantener datos de ejemplo para el historial
      setHistorialSalidas([
        {
          numeroRemito: '1',
          fecha: '2024-01-15',
          proveedor: 'Aceros del Norte S.A.',
          items: [
            {
              id: 1,
              descripcion: 'Acero inoxidable 304',
              kilos: 500.25,
              unidades: 0,
              categoria: 'Metales',
              proveedor: 'Aceros del Norte S.A.',
              partida: 'P-001'
            }
          ]
        },
        {
          numeroRemito: '2',
          fecha: '2024-01-14',
          proveedor: 'Tornillos Rápidos',
          items: [
            {
              id: 2,
              descripcion: 'Tornillos M8x20',
              kilos: 0,
              unidades: 1000,
              categoria: 'Fijación',
              proveedor: 'Tornillos Rápidos',
              partida: 'P-002'
            }
          ]
        }
      ]);
    }
  };

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

  const handleSubmitRemito = async (formData) => {
    try {
      // TODO: Implementar llamada a API real
      const remitoData = {
        selectedItem: selectedItem,
        kilos: parseFloat(formData.kilos) || 0,
        unidades: parseInt(formData.unidades) || 0,
        id: selectedPosicion.posicionId,
        proveedor: selectedItem.proveedor?.id,
        fecha: formData.fecha,
        cliente: formData.cliente,
        partida: formData.partida
      };

      const response = await fetch('/api/movimientos/generarRemitoSalida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(remitoData)
      });

      if (response.ok) {
        // Recargar datos
        dispatch(fetchPosicionesConItems());
        await fetchHistorialSalidas();
        setFormOpen(false);
        setSelectedItem(null);
        setSelectedPosicion(null);
      } else {
        throw new Error('Error al generar remito');
      }
    } catch (error) {
      console.error('Error al generar remito:', error);
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
          
          {/* Header con búsqueda y filtros */}
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
          
          <Box sx={{ width: '100%', mt: 3 }}>
            <SalidaTabs 
              tabValue={tabValue}
              onTabChange={handleTabChange}
              salidasPendientesCount={0} // TODO: Implementar contador real
              salidasAprobadasCount={historialSalidas.length}
              remitosCount={historialSalidas.length}
            />
            
            {/* Contenido de las pestañas */}
            <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
              {tabValue === 0 ? (
                // Pestaña de Remito Salida (PRINCIPAL) - Panel de Control
                <div>
                  <Typography variant="h6" gutterBottom>
                    Stock Disponible por Posición
                  </Typography>
                  
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
                  <Typography variant="h6" gutterBottom>
                    Historial de Salidas
                  </Typography>
                  
                  {historialSalidas.length === 0 ? (
                    <EmptyState 
                      icon={HistoryIcon}
                      {...EMPTY_STATE_MESSAGES.HISTORIAL}
                      searchTerm=""
                    />
                  ) : (
                    <Grid container spacing={3}>
                      {historialSalidas.map((remito) => (
                        <Grid item xs={12} sm={6} md={4} key={remito.numeroRemito}>
                          <SalidaCard 
                            salida={remito}
                            onAprobar={() => {}}
                            onRechazar={() => {}}
                            onCompletar={() => {}}
                            loading={isLoading}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </div>
              )}
            </Paper>
          </Box>

          {/* Formulario de Remito */}
          <SalidaForm
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSubmit={handleSubmitRemito}
            loading={isLoading}
            selectedItem={selectedItem}
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