import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import {
  fetchOrdenesPedido,
  generarPicking,
  clearError
} from '../../../../features/ordenesPedido/model/slice';
import { API_CONFIG } from '../../../../config/api';
import {
  selectOrdenes,
  selectLoading,
  selectError,
  selectOrdenesPorFecha,
  selectOrdenesConPicking
} from '../../../../features/ordenesPedido/model/selectors';

// Funciones de fecha nativas
const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  let d;
  if (typeof date === 'string') {
    // Si es string, intentar parsearlo
    d = new Date(date);
  } else {
    d = new Date(date);
  }
  
  // Verificar si la fecha es válida
  if (isNaN(d.getTime())) {
    console.warn('Fecha inválida:', date);
    return 'Fecha inválida';
  }
  
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
};

const parseISODate = (dateString) => {
  return new Date(dateString);
};

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const PickingPorFechaTab = ({ params = {} }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Selectores
  const ordenes = useSelector(selectOrdenes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const ordenesPorFecha = useSelector(selectOrdenesPorFecha);
  const ordenesConPicking = useSelector(selectOrdenesConPicking);

  // Estados locales
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    params.fecha || new Date().toISOString().split('T')[0]
  );
  const [numeroOrdenSeleccionado, setNumeroOrdenSeleccionado] = useState(
    params.numeroOrden || ''
  );
  const [clienteSeleccionado, setClienteSeleccionado] = useState(
    params.clienteId || ''
  );
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [numerosOrdenDisponibles, setNumerosOrdenDisponibles] = useState([]);
  const [clientesDisponibles, setClientesDisponibles] = useState([]);
  const [pickingGenerado, setPickingGenerado] = useState(false);

  // Cargar fechas disponibles al montar el componente
  useEffect(() => {
    cargarFechasDisponibles();
  }, []);

  // Cargar números de orden cuando cambia la fecha
  useEffect(() => {
    if (fechaSeleccionada) {
      cargarNumerosOrdenPorFecha();
      setNumeroOrdenSeleccionado('');
      setClienteSeleccionado('');
    }
  }, [fechaSeleccionada]);

  // Cargar clientes cuando cambia la fecha y número de orden
  useEffect(() => {
    if (fechaSeleccionada && numeroOrdenSeleccionado) {
      cargarClientesPorFechaYNumero();
      setClienteSeleccionado('');
    }
  }, [fechaSeleccionada, numeroOrdenSeleccionado]);

  // Cargar órdenes cuando cambian los filtros
  useEffect(() => {
    if (fechaSeleccionada) {
      cargarOrdenes();
    }
  }, [fechaSeleccionada, numeroOrdenSeleccionado, clienteSeleccionado]);

  // Funciones para cargar datos
  const cargarFechasDisponibles = async () => {
    try {
      const url = `${API_CONFIG.BASE_URL}/ordenes-pedido/fechas-disponibles`;
      console.log('Cargando fechas desde:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const fechas = await response.json();
      setFechasDisponibles(fechas);
    } catch (error) {
      console.error('Error al cargar fechas:', error);
    }
  };

  const cargarNumerosOrdenPorFecha = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/ordenes-pedido/numeros-orden-por-fecha?fecha=${fechaSeleccionada}`);
      const numeros = await response.json();
      setNumerosOrdenDisponibles(numeros);
    } catch (error) {
      console.error('Error al cargar números de orden:', error);
    }
  };

  const cargarClientesPorFechaYNumero = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/ordenes-pedido/clientes-por-fecha-y-numero?fecha=${fechaSeleccionada}&numeroOrden=${numeroOrdenSeleccionado}`);
      const clientes = await response.json();
      setClientesDisponibles(clientes);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const cargarOrdenes = async () => {
    try {
      let url = `${API_CONFIG.BASE_URL}/ordenes-pedido/por-fecha-y-numero?fecha=${fechaSeleccionada}`;
      if (numeroOrdenSeleccionado) {
        url += `&numeroOrden=${numeroOrdenSeleccionado}`;
      }
      if (clienteSeleccionado) {
        url += `&clienteId=${clienteSeleccionado}`;
      }
      
      const response = await fetch(url);
      const ordenes = await response.json();
      
      // Actualizar el estado de Redux directamente
      dispatch({
        type: 'ordenesPedido/fetchOrdenesPedido/fulfilled',
        payload: ordenes
      });
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      dispatch({
        type: 'ordenesPedido/fetchOrdenesPedido/rejected',
        error: error.message
      });
    }
  };

  // Handlers
  const handleFechaChange = (event) => {
    setFechaSeleccionada(event.target.value);
    setPickingGenerado(false);
  };

  const handleNumeroOrdenChange = (event) => {
    setNumeroOrdenSeleccionado(event.target.value);
    setPickingGenerado(false);
  };

  const handleClienteChange = (event) => {
    setClienteSeleccionado(event.target.value);
    setPickingGenerado(false);
  };

  const handleGenerarPicking = async () => {
    if (ordenes.length === 0) return;

    try {
      // Generar picking para todas las órdenes
      const promesasPicking = ordenes.map(orden => 
        dispatch(generarPicking({
          ordenId: orden.id,
          fechaPicking: fechaSeleccionada
        }))
      );

      await Promise.all(promesasPicking);
      setPickingGenerado(true);
    } catch (error) {
      console.error('Error al generar picking:', error);
    }
  };

  const handleRefresh = () => {
    cargarOrdenes();
    setPickingGenerado(false);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    
    // Si la fecha ya está en formato YYYY-MM-DD, formatearla directamente
    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Si no, intentar convertir a Date
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return 'Fecha inválida';
    return formatDate(fechaObj);
  };

  const formatearMoneda = (valor) => {
    if (!valor) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(valor);
  };

  const calcularTotalKilos = () => {
    return ordenes.reduce((total, orden) => total + (orden.totalKilos || 0), 0);
  };

  const calcularItemsTotal = () => {
    return ordenes.reduce((total, orden) => total + (orden.items?.length || 0), 0);
  };

  const obtenerEstadisticas = () => {
    const estadisticas = {
      total: ordenes.length,
      totalKilos: calcularTotalKilos(),
      totalItems: calcularItemsTotal()
    };

    return estadisticas;
  };

  const estadisticas = obtenerEstadisticas();

  if (loading && ordenes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros de Picking
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Fecha</InputLabel>
                <Select
                  value={fechaSeleccionada}
                  label="Fecha"
                  onChange={handleFechaChange}
                >
                  {fechasDisponibles.map((fecha) => {
                    const fechaFormateada = formatearFecha(fecha);
                    return (
                      <MenuItem key={fecha} value={fecha}>
                        {fechaFormateada}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth disabled={!fechaSeleccionada}>
                <InputLabel>Número de Orden</InputLabel>
                <Select
                  value={numeroOrdenSeleccionado}
                  label="Número de Orden"
                  onChange={handleNumeroOrdenChange}
                  disabled={!fechaSeleccionada}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {numerosOrdenDisponibles.map((numero) => (
                    <MenuItem key={numero} value={numero}>
                      {numero}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth disabled={!numeroOrdenSeleccionado}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={clienteSeleccionado}
                  label="Cliente"
                  onChange={handleClienteChange}
                  disabled={!numeroOrdenSeleccionado}
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {clientesDisponibles.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  onClick={handleGenerarPicking}
                  disabled={!fechaSeleccionada || !numeroOrdenSeleccionado || !clienteSeleccionado || loading}
                  startIcon={<AssignmentIcon />}
                  fullWidth
                >
                  Generar Picking
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleRefresh}
                  disabled={loading}
                  startIcon={<RefreshIcon />}
                >
                  Actualizar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary">
                {estadisticas.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Órdenes Filtradas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="info.main">
                {estadisticas.totalKilos} kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Kilos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="success.main">
                {estadisticas.totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resumen */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumen de Órdenes Filtradas
            </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Total de Órdenes: <strong>{estadisticas.total}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Kilos: <strong>{estadisticas.totalKilos} kg</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Items Total: <strong>{estadisticas.totalItems}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estado Picking: <strong>{pickingGenerado ? 'Generado' : 'Pendiente'}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de órdenes filtradas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Órdenes ({ordenes.length})
          </Typography>
          
          {ordenes.length === 0 ? (
            <Box textAlign="center" py={4}>
              <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No hay órdenes para los filtros seleccionados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ajuste los filtros o seleccione otra fecha
              </Typography>
            </Box>
          ) : (
            <Box>
              {ordenes.map((orden) => (
                <Accordion key={`${orden.numeroOrden}-${orden.proveedor?.id}`} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <Box flexGrow={1}>
                        <Typography variant="h6">
                          Orden: {orden.numeroOrden}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Cliente: {orden.proveedor?.nombre} | 
                          Fecha: {formatearFecha(orden.fecha)} | 
                          Items: {orden.items?.length || 0} | 
                          Total: {orden.totalKilos || 0} kg
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell align="right">Kilos</TableCell>
                            <TableCell align="right">Unidades</TableCell>
                            <TableCell>Partida</TableCell>
                            <TableCell>Posición</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orden.items?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {item.item?.descripcion}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={item.item?.categoria} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="medium">
                                  {item.kilos} kg
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2">
                                  {item.unidades || 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {item.partida?.numeroPartida || 'Sin asignar'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {item.posicion?.nombre || 'Sin asignar'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Detalles de picking generado */}
      {pickingGenerado && ordenes.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="success.main">
              Picking Generado Exitosamente
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Se ha generado el picking para {ordenes.length} órdenes.
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                color="primary"
              >
                Imprimir Picking
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Descargar PDF
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
