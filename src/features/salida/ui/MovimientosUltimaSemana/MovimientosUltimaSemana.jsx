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
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
  const [fechaHasta, setFechaHasta] = useState('');

  // Calcular fecha por defecto (una semana atrás) y cargar datos iniciales
  useEffect(() => {
    const fechaUnaSemanaAtras = new Date();
    fechaUnaSemanaAtras.setDate(fechaUnaSemanaAtras.getDate() - 7);
    const fechaFormateada = fechaUnaSemanaAtras.toISOString().split('T')[0];
    setFechaDesde(fechaFormateada);
    
    // Fecha actual como fecha hasta por defecto
    const fechaActual = new Date().toISOString().split('T')[0];
    setFechaHasta(fechaActual);
    
    // Cargar datos iniciales con las fechas por defecto
    fetchMovimientos(fechaFormateada, fechaActual);
  }, []);

  const fetchMovimientos = async (fechaDesde = null, fechaHasta = null) => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/movimientos/salida-ultima-semana';
      const params = new URLSearchParams();
      
      if (fechaDesde) {
        params.append('fechaDesde', fechaDesde);
      }
      if (fechaHasta) {
        params.append('fechaHasta', fechaHasta);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      setMovimientos(response.data);
    } catch (err) {
      console.error('Error al obtener movimientos:', err);
      setError('Error al cargar los movimientos de salida');
    } finally {
      setLoading(false);
    }
  };

  // Remover el useEffect que se ejecuta automáticamente al cambiar fechas
  // useEffect(() => {
  //   if (fechaDesde && fechaHasta) {
  //     fetchMovimientos(fechaDesde, fechaHasta);
  //   }
  // }, [fechaDesde, fechaHasta]);

  const handleFechaDesdeChange = (event) => {
    setFechaDesde(event.target.value);
  };

  const handleFechaHastaChange = (event) => {
    setFechaHasta(event.target.value);
  };

  const handleBuscar = () => {
    if (!fechaDesde || !fechaHasta) {
      setError('Por favor, complete ambas fechas antes de buscar');
      return;
    }
    
    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      setError('La fecha "desde" no puede ser mayor que la fecha "hasta"');
      return;
    }
    
    setError(null);
    fetchMovimientos(fechaDesde, fechaHasta);
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
             <Grid item xs={12} sm={6} md={3}>
               <TextField
                 fullWidth
                 type="date"
                 label="Fecha desde"
                 value={fechaDesde}
                 onChange={handleFechaDesdeChange}
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
             <Grid item xs={12} sm={6} md={3}>
               <TextField
                 fullWidth
                 type="date"
                 label="Fecha hasta"
                 value={fechaHasta}
                 onChange={handleFechaHastaChange}
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
             <Grid item xs={12} sm={6} md={3}>
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
                <Accordion defaultExpanded={false}>
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
                      <Chip
                        icon={<ReceiptIcon />}
                        label={`Remito #${grupo.remitos[0]?.numeroRemito || 'N/A'}`}
                        color="info"
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
                      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--color-background-secondary)' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Partida</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Proveedor</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Kilos</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>Unidades</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {grupo.remitos.flatMap((remito, remitoIndex) => 
                              remito.items.map((item, itemIndex) => (
                                <TableRow key={`${remitoIndex}-${itemIndex}`}>
                                  <TableCell>{item.descripcion}</TableCell>
                                  <TableCell>{item.categoria}</TableCell>
                                  <TableCell>{item.partida}</TableCell>
                                  <TableCell>{item.proveedor}</TableCell>
                                  <TableCell>{item.kilos}</TableCell>
                                  <TableCell>{item.unidades}</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
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
