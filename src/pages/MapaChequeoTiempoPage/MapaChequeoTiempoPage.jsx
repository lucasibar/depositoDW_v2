import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { Refresh, Info } from '@mui/icons-material';
import { useChequeosConTiempo } from '../../hooks/useChequeosConTiempo';
import LeyendaChequeos from '../../components/MapaDeposito/LeyendaChequeos';
import ChequeoPosicionModal from '../../components/MapaDeposito/ChequeoPosicionModal';

const MapaChequeoTiempoPage = () => {
  const {
    posiciones,
    loading,
    error,
    obtenerPosicionesConChequeos,
    calcularEstadoChequeo,
    obtenerColorPorEstado,
    obtenerDescripcionEstado
  } = useChequeosConTiempo();

  const [posicionSeleccionada, setPosicionSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handlePosicionClick = (posicion) => {
    setPosicionSeleccionada(posicion);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setPosicionSeleccionada(null);
  };

  const handleChequeoActualizado = () => {
    obtenerPosicionesConChequeos();
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const contarPosicionesPorEstado = () => {
    const conteo = {
      'sin-chequeo': 0,
      'reciente': 0,
      'semana': 0,
      'dos-semanas': 0,
      'mes': 0
    };

    posiciones.forEach(posicion => {
      const estado = calcularEstadoChequeo(posicion.ultimo_chequeo);
      conteo[estado]++;
    });

    return conteo;
  };

  const conteoEstados = contarPosicionesPorEstado();

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
          Cargando mapa de chequeos...
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
              onClick={obtenerPosicionesConChequeos}
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
          Mapa de Chequeos por Tiempo
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Actualizar datos">
            <IconButton 
              onClick={obtenerPosicionesConChequeos}
              disabled={loading}
              sx={{ color: 'var(--color-primary)' }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'var(--color-background-secondary)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Resumen de Estados
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label={`Recientes: ${conteoEstados.reciente}`} 
            sx={{ backgroundColor: '#4CAF50', color: 'white' }}
          />
          <Chip 
            label={`1-2 semanas: ${conteoEstados.semana}`} 
            sx={{ backgroundColor: '#FFEB3B', color: 'black' }}
          />
          <Chip 
            label={`2 semanas-1 mes: ${conteoEstados['dos-semanas']}`} 
            sx={{ backgroundColor: '#FF9800', color: 'white' }}
          />
          <Chip 
            label={`Más de 1 mes: ${conteoEstados.mes}`} 
            sx={{ backgroundColor: '#F44336', color: 'white' }}
          />
          <Chip 
            label={`Sin chequeo: ${conteoEstados['sin-chequeo']}`} 
            sx={{ backgroundColor: '#9E9E9E', color: 'white' }}
          />
        </Box>
      </Paper>

      {/* Leyenda */}
      <LeyendaChequeos />

      {/* Mapa de Posiciones */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: 'var(--color-background-primary)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Posiciones del Depósito
        </Typography>
        
        {posiciones.length === 0 ? (
          <Alert severity="info">
            No hay posiciones disponibles para mostrar.
          </Alert>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: 2 
          }}>
            {posiciones.map((posicion) => {
              const estado = calcularEstadoChequeo(posicion.ultimo_chequeo);
              const color = obtenerColorPorEstado(estado);
              
              return (
                <Paper
                  key={posicion.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: color,
                    color: estado === 'semana' ? 'black' : 'white',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => handlePosicionClick(posicion)}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {formatPositionString(posicion)}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                    {obtenerDescripcionEstado(estado)}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Último chequeo: {formatFechaChequeo(posicion.ultimo_chequeo)}
                  </Typography>
                  
                  {posicion.nombre && (
                    <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                      Por: {posicion.nombre}
                    </Typography>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}
      </Paper>

      {/* Modal de Chequeo */}
      <ChequeoPosicionModal
        open={modalAbierto}
        onClose={handleCerrarModal}
        posicion={posicionSeleccionada}
        onChequeoActualizado={handleChequeoActualizado}
      />
    </Box>
  );
};

export default MapaChequeoTiempoPage;
