import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Divider,
  Badge
} from '@mui/material';
import { 
  Refresh, 
  CheckCircle, 
  MoveToInbox, 
  Warning, 
  Schedule,
  Assignment,
  TrendingUp
} from '@mui/icons-material';
import { useTareasPendientes } from '../../hooks/useTareasPendientes';
import ChequeoPosicionModal from '../../components/MapaDeposito/ChequeoPosicionModal';
import MovimientosRecomendadosTab from '../MovimientosMercaderiaPage/components/MovimientosRecomendadosTab';

const DashboardTareasPage = () => {
  const {
    posicionesParaChequear,
    movimientosPendientes,
    estadisticas,
    loading,
    error,
    obtenerTareasPendientes,
    calcularPrioridadChequeo,
    calcularPrioridadMovimiento,
    obtenerColorPrioridad
  } = useTareasPendientes();

  const [posicionSeleccionada, setPosicionSeleccionada] = useState(null);
  const [modalChequeoAbierto, setModalChequeoAbierto] = useState(false);

  const handleChequeoPosicion = (posicion) => {
    setPosicionSeleccionada(posicion);
    setModalChequeoAbierto(true);
  };

  const handleCerrarModalChequeo = () => {
    setModalChequeoAbierto(false);
    setPosicionSeleccionada(null);
  };

  const handleChequeoActualizado = () => {
    obtenerTareasPendientes();
  };

  const formatPositionString = (pos) => {
    if (!pos) return 'N/A';
    if (pos.entrada) return 'ENTRADA';
    if (pos.numeroPasillo) return `Pasillo ${pos.numeroPasillo}`;
    return `Rack ${pos.rack}-${pos.fila}-${pos.AB}`;
  };

  const formatFechaChequeo = (fecha) => {
    if (!fecha) return 'Sin chequeo';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFechaMovimiento = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calcularDiasSinChequeo = (fechaUltimoChequeo) => {
    if (!fechaUltimoChequeo) return 'Nunca';
    
    const ahora = new Date();
    const fechaChequeo = new Date(fechaUltimoChequeo);
    const diasTranscurridos = Math.floor((ahora - fechaChequeo) / (1000 * 60 * 60 * 24));
    
    return `${diasTranscurridos} días`;
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando tareas pendientes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <IconButton 
              color="inherit" 
              size="small" 
              onClick={obtenerTareasPendientes}
            >
              <Refresh />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Dashboard de Tareas Pendientes
        </Typography>
        
        <IconButton 
          onClick={obtenerTareasPendientes}
          disabled={loading}
          sx={{ color: 'var(--color-primary)' }}
        >
          <Refresh />
        </IconButton>
      </Box>

      {/* Estadísticas Generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#E3F2FD' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976D2' }}>
                    {estadisticas.totalPosicionesChequeo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posiciones para Chequear
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#1976D2' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF3E0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#F57C00' }}>
                    {estadisticas.posicionesUrgentes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chequeos Urgentes
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: '#F57C00' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#F3E5F5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#7B1FA2' }}>
                    {estadisticas.movimientosPendientes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Movimientos Pendientes
                  </Typography>
                </Box>
                <MoveToInbox sx={{ fontSize: 40, color: '#7B1FA2' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFEBEE' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, color: '#D32F2F' }}>
                    {estadisticas.movimientosUrgentes}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Movimientos Urgentes
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: '#D32F2F' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Posiciones que necesitan chequeo */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CheckCircle sx={{ mr: 1, color: 'var(--color-primary)' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Posiciones que Necesitan Chequeo
              </Typography>
              <Badge 
                badgeContent={posicionesParaChequear.length} 
                color="error" 
                sx={{ ml: 2 }}
              />
            </Box>

            {posicionesParaChequear.length === 0 ? (
              <Alert severity="success">
                ¡Excelente! Todas las posiciones están al día con sus chequeos.
              </Alert>
            ) : (
              <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
                {posicionesParaChequear.map((posicion) => {
                  const prioridad = calcularPrioridadChequeo(posicion.ultimo_chequeo);
                  const colorPrioridad = obtenerColorPrioridad(prioridad);
                  
                  return (
                    <Card key={posicion.id} sx={{ mb: 2, border: `2px solid ${colorPrioridad}` }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {formatPositionString(posicion)}
                          </Typography>
                          <Chip 
                            label={prioridad.toUpperCase()} 
                            size="small"
                            sx={{ 
                              backgroundColor: colorPrioridad, 
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Último chequeo: {formatFechaChequeo(posicion.ultimo_chequeo)}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          Sin chequeo por: {calcularDiasSinChequeo(posicion.ultimo_chequeo)}
                        </Typography>
                      </CardContent>
                      
                      <CardActions>
                        <Button 
                          size="small" 
                          variant="contained"
                          onClick={() => handleChequeoPosicion(posicion)}
                          startIcon={<CheckCircle />}
                        >
                          Registrar Chequeo
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Movimientos recomendados */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MoveToInbox sx={{ mr: 1, color: 'var(--color-primary)' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Movimientos Recomendados
              </Typography>
              <Badge 
                badgeContent={movimientosPendientes.length} 
                color="error" 
                sx={{ ml: 2 }}
              />
            </Box>

            <MovimientosRecomendadosTab 
              movimientosRecomendados={movimientosPendientes}
              estadisticas={estadisticas}
              onRefresh={obtenerTareasPendientes}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de Chequeo */}
      <ChequeoPosicionModal
        open={modalChequeoAbierto}
        onClose={handleCerrarModalChequeo}
        posicion={posicionSeleccionada}
        onChequeoActualizado={handleChequeoActualizado}
      />
    </Box>
  );
};

export default DashboardTareasPage;
