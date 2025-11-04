import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress, Divider } from '@mui/material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { useChequeosConTiempo } from '../../hooks/useChequeosConTiempo';
import { authService } from '../../services/authService';

const estadoALabel = {
  'reciente': 'hace poco',
  'semana': 'hace mucho',
  'dos-semanas': 'hace mucho',
  'mes': 'hace muchisimo',
  'sin-chequeo': 'sin chequeo'
};

const formatFechaChequeo = (fecha) => {
  if (!fecha) return 'Nunca';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const ChecklistChequeoPage = () => {
  const [user, setUser] = useState(null);
  const {
    posiciones,
    loading,
    error,
    obtenerPosicionesConChequeos,
    calcularEstadoChequeo,
    obtenerColorPorEstado,
  } = useChequeosConTiempo();

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    obtenerPosicionesConChequeos();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  return (
    <AppLayout user={user} onLogout={handleLogout} pageTitle="Chequeo de Posiciones">
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Chequeo de Posiciones
        </Typography>

        {/* Leyenda */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
          {[
            { estado: 'reciente' },
            { estado: 'semana' },
            { estado: 'dos-semanas' },
            { estado: 'mes' },
            { estado: 'sin-chequeo' },
          ].map(({ estado }) => (
            <Chip
              key={estado}
              label={estadoALabel[estado]}
              sx={{ backgroundColor: obtenerColorPorEstado(estado), color: '#fff', fontWeight: 600 }}
              size="small"
            />
          ))}
        </Box>

        <Paper sx={{ overflow: 'hidden' }}>
          {/* Header de la tabla */}
          <Box sx={{ 
            display: { xs: 'none', md: 'grid' }, 
            gridTemplateColumns: '200px 1fr 200px 200px',
            gap: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            color: '#666'
          }}>
            <Typography>Posición</Typography>
            <Typography>Chequeado por</Typography>
            <Typography>Último chequeo</Typography>
            <Typography>Próximo chequeo</Typography>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box sx={{ p: 3 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {!loading && !error && posiciones.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No hay posiciones para mostrar</Typography>
            </Box>
          )}

          {!loading && !error && posiciones.length > 0 && (
            <Box>
              {posiciones.map((pos, index) => {
                const estado = calcularEstadoChequeo(pos.ultimo_chequeo || pos.ultimoChequeo);
                const color = obtenerColorPorEstado(estado);
                const nombrePosicion = pos.nombre || `${pos.rack ?? ''}-${pos.fila ?? ''}-${pos.AB ?? ''}`;
                const chequeadoPor = pos.chequeadoPor || pos.chequeado_por || pos.nombreChequeo || pos.nombre_chequeo || 'N/A';
                const ultimoChequeo = pos.ultimo_chequeo || pos.ultimoChequeo || null;
                const proximoChequeo = pos.proximoChequeo || pos.proximo_chequeo || null; // Campo que agregarán después

                return (
                  <Box key={pos.id || `${pos.rack}-${pos.fila}-${pos.AB}-${index}`}>
                    <Box sx={{ 
                      display: { xs: 'flex', md: 'grid' },
                      flexDirection: { xs: 'column', md: 'row' },
                      gridTemplateColumns: { md: '200px 1fr 200px 200px' },
                      gap: { xs: 1, md: 2 },
                      p: 2,
                      alignItems: { xs: 'flex-start', md: 'center' },
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#fafafa'
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: color,
                          flexShrink: 0
                        }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          {nombrePosicion}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: { xs: 'flex', md: 'block' }, 
                        flexDirection: { xs: 'column' },
                        gap: { xs: 0.5 }
                      }}>
                        <Typography sx={{ 
                          color: '#999', 
                          fontSize: { xs: '0.75rem', md: '0.9rem' },
                          fontWeight: { xs: 600, md: 400 },
                          display: { xs: 'block', md: 'none' }
                        }}>
                          Chequeado por:
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                          {chequeadoPor}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: { xs: 'flex', md: 'block' }, 
                        flexDirection: { xs: 'column' },
                        gap: { xs: 0.5 }
                      }}>
                        <Typography sx={{ 
                          color: '#999', 
                          fontSize: { xs: '0.75rem', md: '0.9rem' },
                          fontWeight: { xs: 600, md: 400 },
                          display: { xs: 'block', md: 'none' }
                        }}>
                          Último chequeo:
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
                          {formatFechaChequeo(ultimoChequeo)}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: { xs: 'flex', md: 'block' }, 
                        flexDirection: { xs: 'column' },
                        gap: { xs: 0.5 }
                      }}>
                        <Typography sx={{ 
                          color: '#999', 
                          fontSize: { xs: '0.75rem', md: '0.9rem' },
                          fontWeight: { xs: 600, md: 400 },
                          display: { xs: 'block', md: 'none' }
                        }}>
                          Próximo chequeo:
                        </Typography>
                        <Typography sx={{ 
                          color: proximoChequeo ? '#666' : '#999',
                          fontSize: '0.9rem',
                          fontStyle: proximoChequeo ? 'normal' : 'italic'
                        }}>
                          {proximoChequeo ? formatFechaChequeo(proximoChequeo) : 'No definido'}
                        </Typography>
                      </Box>
                    </Box>
                    {index < posiciones.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Box>
    </AppLayout>
  );
};

export default ChecklistChequeoPage;


