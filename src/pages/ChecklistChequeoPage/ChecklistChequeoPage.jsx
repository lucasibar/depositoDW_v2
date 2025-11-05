import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress, Divider, TextField, MenuItem, Button, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import PageNavigationMenu from '../../components/PageNavigationMenu';
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
  if (isNaN(date.getTime())) return 'Nunca';
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFechaProximoChequeo = (fecha) => {
  if (!fecha) return 'No definido';
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return 'No definido';
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
    registrarChequeo,
  } = useChequeosConTiempo();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    obtenerPosicionesConChequeos();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  const estados = [
    { value: 'todos', label: 'Todos' },
    { value: 'reciente', label: estadoALabel['reciente'] },
    { value: 'semana', label: estadoALabel['semana'] },
    { value: 'dos-semanas', label: estadoALabel['dos-semanas'] },
    { value: 'mes', label: estadoALabel['mes'] },
    { value: 'sin-chequeo', label: estadoALabel['sin-chequeo'] },
  ];

  const posicionesFiltradas = useMemo(() => {
    const normalize = (s) => (s || '')
      .toString()
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    const stripNonAlnum = (s) => normalize(s).replace(/[^a-z0-9]/g, '');

    const qRaw = normalize(busqueda);
    const tokens = qRaw ? qRaw.split(/\s+/).filter(Boolean) : [];
    const qStripped = stripNonAlnum(qRaw);
    return posiciones.filter((pos) => {
      const rack = normalize(pos.rack);
      const fila = normalize(pos.fila);
      const ab = normalize(pos.AB || pos.ab || pos.nivel);
      const pasillo = normalize(pos.numeroPasillo || pos.pasillo);
      // Construir nombre visible igual que en la renderización (ignorar pos.nombre que puede tener nombre de usuario)
      const nombreVisible = pos.numeroPasillo 
        ? normalize(`Pasillo ${pos.numeroPasillo}`)
        : normalize(`${rack || ''}-${fila || ''}-${ab || ''}`);
      const variantes = [
        nombreVisible,
        `${rack}-${fila}-${ab}`,
        pasillo ? `pasillo ${pasillo}` : '',
        `${pasillo}-${rack}-${fila}-${ab}`,
        `${rack}${fila}${ab}`,
        `${pasillo}${rack}${fila}${ab}`,
        [rack, fila, ab, pasillo].filter(Boolean).join(' '),
      ].filter(Boolean);
      const variantesStripped = variantes.map(stripNonAlnum);
      const estado = calcularEstadoChequeo(pos.ultimo_chequeo || pos.ultimoChequeo);
      const coincideEstado = filtroEstado === 'todos' || estado === filtroEstado;
      const coincideTexto = !qRaw 
        || tokens.some(t => variantes.some(v => v.includes(t)))
        || (!!qStripped && variantesStripped.some(v => v.includes(qStripped)));
      return coincideTexto && coincideEstado;
    });
  }, [posiciones, busqueda, filtroEstado, calcularEstadoChequeo]);

  const handleMarcarChequeado = async (posicionId) => {
    const nombre = user?.name || 'Usuario';
    const res = await registrarChequeo(posicionId, nombre);
    if (res.ok) {
      setSnackbar({ open: true, message: 'Chequeo registrado', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: res.error || 'Error al registrar chequeo', severity: 'error' });
    }
  };

  return (
    <AppLayout user={user} onLogout={handleLogout} pageTitle="Chequeo de Posiciones">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Chequeo de Posiciones
          </Typography>
          <PageNavigationMenu user={user} currentPath={location.pathname} />
        </Box>
        

        {/* Controles de filtro */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Buscar posición"
            placeholder="rack-fila-nivel-pasillo"
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <TextField
            select
            label="Estado"
            size="small"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {estados.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" onClick={() => { setBusqueda(''); setFiltroEstado('todos'); }}>Limpiar filtros</Button>
        </Box>

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

          {!loading && !error && posicionesFiltradas.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No hay posiciones para mostrar</Typography>
            </Box>
          )}

          {!loading && !error && posicionesFiltradas.length > 0 && (
            <Box>
              {posicionesFiltradas.map((pos, index) => {
                const estado = calcularEstadoChequeo(pos.ultimo_chequeo || pos.ultimoChequeo);
                const color = obtenerColorPorEstado(estado);
                // Siempre construir el nombre de posición desde rack-fila-AB (ignorar pos.nombre que puede tener el nombre del usuario)
                const nombrePosicion = pos.numeroPasillo 
                  ? `Pasillo ${pos.numeroPasillo}`
                  : `${pos.rack ?? ''}-${pos.fila ?? ''}-${pos.AB ?? ''}`;
                // El nombre de quien chequeó está en pos.nombre cuando hay chequeo
                const chequeadoPor = pos.ultimo_chequeo || pos.ultimoChequeo 
                  ? (pos.nombre || pos.chequeadoPor || pos.chequeado_por || pos.nombreChequeo || pos.nombre_chequeo || 'N/A')
                  : 'N/A';
                const ultimoChequeo = pos.ultimo_chequeo || pos.ultimoChequeo || null;
                const proximoChequeo = pos.proximoChequeo || pos.proximo_chequeo || null; // Campo que agregarán después

                return (
                  <Box key={pos.id || `${pos.rack}-${pos.fila}-${pos.AB}-${index}`}>
                    <Box sx={{ 
                      display: { xs: 'flex', md: 'grid' },
                      flexDirection: { xs: 'column', md: 'row' },
                      gridTemplateColumns: { md: '200px 1fr 200px 200px 180px' },
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
                          {formatFechaProximoChequeo(proximoChequeo)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleMarcarChequeado(pos.id)}
                        >
                          Marcar chequeado
                        </Button>
                      </Box>
                    </Box>
                    {index < posicionesFiltradas.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  );
};

export default ChecklistChequeoPage;


