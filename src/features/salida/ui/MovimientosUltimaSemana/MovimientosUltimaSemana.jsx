import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { apiClient } from '../../../../config/api';

export const MovimientosUltimaSemana = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fechaDesde, setFechaDesde] = useState('');

  // Calcular fecha por defecto (una semana atrás)
  useEffect(() => {
    const fechaUnaSemanaAtras = new Date();
    fechaUnaSemanaAtras.setDate(fechaUnaSemanaAtras.getDate() - 7);
    const fechaFormateada = fechaUnaSemanaAtras.toISOString().split('T')[0];
    setFechaDesde(fechaFormateada);
  }, []);

  const fetchMovimientos = async (fecha = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = fecha 
        ? `/movimientos/salida-ultima-semana?fechaDesde=${fecha}`
        : '/movimientos/salida-ultima-semana';
      
      const response = await apiClient.get(url);
      setMovimientos(response.data);
    } catch (err) {
      console.error('Error al obtener movimientos:', err);
      setError('Error al cargar los movimientos de salida');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaDesde) {
      fetchMovimientos(fechaDesde);
    }
  }, [fechaDesde]);

  const handleFechaChange = (event) => {
    setFechaDesde(event.target.value);
  };

  const handleBuscar = () => {
    fetchMovimientos(fechaDesde);
  };

  const calcularTotalKilos = (remitos) => {
    return remitos.reduce((total, remito) => {
      return total + remito.items.reduce((remitoTotal, item) => {
        return remitoTotal + (item.kilos || 0);
      }, 0);
    }, 0);
  };

  const calcularTotalUnidades = (remitos) => {
    return remitos.reduce((total, remito) => {
      return total + remito.items.reduce((remitoTotal, item) => {
        return remitoTotal + (item.unidades || 0);
      }, 0);
    }, 0);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header con filtros */}
      <Card sx={{ mb: 3, backgroundColor: 'var(--color-background-secondary)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
            <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Movimientos de Salida por Período
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Fecha desde"
                value={fechaDesde}
                onChange={handleFechaChange}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--color-background-primary)',
                    '& fieldset': {
                      borderColor: 'var(--color-divider)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--color-primary)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                onClick={handleBuscar}
                startIcon={<CalendarIcon />}
                sx={{ 
                  backgroundColor: 'var(--color-primary)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-dark)',
                  }
                }}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Lista de movimientos */}
      {movimientos.length === 0 && !loading ? (
        <Card>
          <CardContent>
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No se encontraron movimientos de salida para el período seleccionado
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box>
          {movimientos.map((grupo, index) => (
            <Card key={index} sx={{ mb: 2, backgroundColor: 'var(--color-background-primary)' }}>
              <CardContent>
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<CalendarIcon />}
                        label={grupo.fecha}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<BusinessIcon />}
                        label={grupo.proveedor}
                        color="secondary"
                        variant="outlined"
                      />
                      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        {grupo.remitos.length} remito{grupo.remitos.length !== 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                        Total: {calcularTotalKilos(grupo.remitos).toFixed(2)} kg, {calcularTotalUnidades(grupo.remitos)} unid.
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  
                  <AccordionDetails>
                    <Box>
                      {grupo.remitos.map((remito, remitoIndex) => (
                        <Card key={remitoIndex} sx={{ mb: 2, backgroundColor: 'var(--color-background-secondary)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <ReceiptIcon color="primary" />
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Remito #{remito.numeroRemito}
                              </Typography>
                            </Box>
                            
                            <Grid container spacing={2}>
                              {remito.items.map((item, itemIndex) => (
                                <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                                  <Card variant="outlined" sx={{ backgroundColor: 'var(--color-background-primary)' }}>
                                    <CardContent sx={{ p: 2 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                        {item.descripcion}
                                      </Typography>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                          <InventoryIcon sx={{ fontSize: '0.8rem', mr: 0.5 }} />
                                          Partida: {item.partida}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
                                          Categoría: {item.categoria}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                          <Chip
                                            label={`${item.kilos} kg`}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                          />
                                          <Chip
                                            label={`${item.unidades} unid.`}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                          />
                                        </Box>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
