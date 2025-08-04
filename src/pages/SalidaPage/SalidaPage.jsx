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
import { authService } from '../../services/authService';
import { SearchBar } from '../../shared/ui/SearchBar/SearchBar';
import AppHeader from '../../shared/ui/AppHeader';
import { SalidaTabs, SalidaCard, EmptyState } from '../../features/salida/ui';
import { useSalidaActions } from '../../features/salida/hooks';
import { EMPTY_STATE_MESSAGES } from '../../features/salida/constants/salidaConstants';
import styles from './SalidaPage.module.css';

export const SalidaPage = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const {
    loading,
    snackbar,
    handleCrearSalida,
    handleAprobarSalida,
    handleRechazarSalida,
    handleCompletarSalida,
    handleCloseSnackbar
  } = useSalidaActions();

  // Cargar usuario al montar el componente
  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearch = (term) => {
    // Implementar búsqueda
    console.log('Buscando:', term);
  };

  // Datos de ejemplo para mostrar la funcionalidad
  const salidasPendientes = [
    {
      id: 1,
      numero: 'SAL-001',
      solicitante: 'Juan Pérez',
      destino: 'Producción A',
      fechaSolicitud: '2024-01-15',
      estado: 'pendiente',
      materiales: [
        { cantidad: 10, unidad: 'unidades', descripcion: 'Tornillos M8x20' },
        { cantidad: 5, unidad: 'kg', descripcion: 'Acero inoxidable' }
      ],
      motivo: 'Mantenimiento preventivo',
      observaciones: 'Urgente para el turno de la tarde'
    },
    {
      id: 2,
      numero: 'SAL-002',
      solicitante: 'María García',
      destino: 'Almacén B',
      fechaSolicitud: '2024-01-15',
      estado: 'pendiente',
      materiales: [
        { cantidad: 20, unidad: 'm', descripcion: 'Cable eléctrico 2.5mm' }
      ],
      motivo: 'Instalación eléctrica',
      observaciones: null
    }
  ];

  const salidasAprobadas = [
    {
      id: 3,
      numero: 'SAL-003',
      solicitante: 'Carlos López',
      destino: 'Taller Mecánico',
      fechaSolicitud: '2024-01-14',
      fechaAprobacion: '2024-01-14',
      estado: 'aprobada',
      materiales: [
        { cantidad: 15, unidad: 'unidades', descripcion: 'Rodamientos 6205' },
        { cantidad: 2, unidad: 'l', descripcion: 'Aceite lubricante' }
      ],
      motivo: 'Reparación de equipos',
      observaciones: 'Aprobado por supervisor'
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader user={user} />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <div className={styles.container}>
          <Typography variant="h4" gutterBottom>
            Panel de Control - Salida
          </Typography>
          
          {/* Barra de búsqueda */}
          <Box sx={{ mb: 3 }}>
            <SearchBar 
              placeholder="Buscar por número de salida, material, solicitante o destino..."
              onSearch={handleSearch}
            />
          </Box>
          
          <Box sx={{ width: '100%', mt: 3 }}>
            <SalidaTabs 
              tabValue={tabValue}
              onTabChange={handleTabChange}
              salidasPendientesCount={salidasPendientes.length}
              salidasAprobadasCount={salidasAprobadas.length}
            />
            
            {/* Contenido de las pestañas */}
            <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
              {tabValue === 0 ? (
                // Pestaña de Salidas Pendientes
                <div>
                  <Typography variant="h6" gutterBottom>
                    Salidas Pendientes
                  </Typography>
                  
                  {salidasPendientes.length === 0 ? (
                    <EmptyState 
                      icon={ExitToAppIcon}
                      {...EMPTY_STATE_MESSAGES.PENDIENTES}
                      searchTerm=""
                    />
                  ) : (
                    <Grid container spacing={3}>
                      {salidasPendientes.map((salida) => (
                        <Grid item xs={12} sm={6} md={4} key={salida.id}>
                          <SalidaCard 
                            salida={salida}
                            onAprobar={handleAprobarSalida}
                            onRechazar={handleRechazarSalida}
                            onCompletar={handleCompletarSalida}
                            loading={loading}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </div>
              ) : (
                // Pestaña de Historial
                <div>
                  <Typography variant="h6" gutterBottom>
                    Historial de Salidas
                  </Typography>
                  
                  {salidasAprobadas.length === 0 ? (
                    <EmptyState 
                      icon={HistoryIcon}
                      {...EMPTY_STATE_MESSAGES.HISTORIAL}
                      searchTerm=""
                    />
                  ) : (
                    <Grid container spacing={3}>
                      {salidasAprobadas.map((salida) => (
                        <Grid item xs={12} sm={6} md={4} key={salida.id}>
                          <SalidaCard 
                            salida={salida}
                            onAprobar={handleAprobarSalida}
                            onRechazar={handleRechazarSalida}
                            onCompletar={handleCompletarSalida}
                            loading={loading}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </div>
              )}
            </Paper>
          </Box>
          
          <Snackbar
            open={snackbar?.open || false}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar?.severity || 'info'}
              sx={{ width: '100%' }}
            >
              {snackbar?.message || ''}
            </Alert>
          </Snackbar>
        </div>
      </Container>
    </Box>
  );
}; 