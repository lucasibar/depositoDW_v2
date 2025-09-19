import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  ContentCopy as CopyIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import {
  fetchOrdenesPedidoAgrupadas,
  setFiltros,
  resetFiltros,
  setPaginacion,
  deleteOrdenPedido,
  clearError,
  setOrdenACopiar,
  clearOrdenACopiar
} from '../../../../features/ordenesPedido/model/slice';
import {
  selectOrdenesPaginadas,
  selectLoading,
  selectError,
  selectFiltros,
  selectPaginacion,
  selectEstadisticasOrdenes
} from '../../../../features/ordenesPedido/model/selectors';

// Funciones de fecha nativas
const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
};

const ESTADOS_ORDEN = {
  pendiente: { label: 'Pendiente', color: 'warning' },
  en_proceso: { label: 'En Proceso', color: 'info' },
  completada: { label: 'Completada', color: 'success' },
  cancelada: { label: 'Cancelada', color: 'error' }
};

export const OrdenesPedidoTab = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Selectores
  const { ordenes, paginacion } = useSelector(selectOrdenesPaginadas);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const filtros = useSelector(selectFiltros);
  const paginacionState = useSelector(selectPaginacion);
  const estadisticas = useSelector(selectEstadisticasOrdenes);

  // Estados locales
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [dialogoEliminar, setDialogoEliminar] = useState(false);
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);
  const [dialogoCopiar, setDialogoCopiar] = useState(false);
  const [ordenACopiar, setOrdenACopiar] = useState(null);

  // Cargar órdenes al montar el componente
  useEffect(() => {
    dispatch(fetchOrdenesPedidoAgrupadas({
      ...filtros,
      pagina: paginacionState.pagina,
      limite: paginacionState.limite
    }));
  }, [dispatch, filtros, paginacionState.pagina, paginacionState.limite]);

  // Handlers
  const handleFiltroChange = (campo, valor) => {
    dispatch(setFiltros({ [campo]: valor }));
    dispatch(setPaginacion({ pagina: 1 })); // Resetear a primera página
  };

  const handleResetFiltros = () => {
    dispatch(resetFiltros());
    dispatch(setPaginacion({ pagina: 1 }));
  };

  const handleCambiarPagina = (event, nuevaPagina) => {
    dispatch(setPaginacion({ pagina: nuevaPagina }));
  };

  const handleVerOrden = (orden) => {
    setOrdenSeleccionada(orden);
  };


  const handleEliminarOrden = (orden) => {
    setOrdenAEliminar(orden);
    setDialogoEliminar(true);
  };

  const confirmarEliminar = () => {
    if (ordenAEliminar) {
      dispatch(deleteOrdenPedido(ordenAEliminar.id));
      setDialogoEliminar(false);
      setOrdenAEliminar(null);
    }
  };

  const handleCopiarOrden = (orden) => {
    setOrdenACopiar(orden);
    setDialogoCopiar(true);
  };

  const confirmarCopiar = () => {
    if (ordenACopiar) {
      setDialogoCopiar(false);
      
      // Navegar a la tab de generar orden con los datos de la orden a copiar
      window.dispatchEvent(new CustomEvent('cambiarTab', { 
        detail: { 
          tabIndex: 0, // Índice de la tab de generar orden
          params: {
            ordenACopiar: ordenACopiar
          }
        } 
      }));
      
      setOrdenACopiar(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchOrdenesPedidoAgrupadas({
      ...filtros,
      pagina: paginacionState.pagina,
      limite: paginacionState.limite
    }));
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

  if (loading && ordenes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Estadísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary">
                {estadisticas.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Órdenes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="warning.main">
                {estadisticas.pendientes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="info.main">
                {estadisticas.enProceso}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En Proceso
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="success.main">
                {estadisticas.completadas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Filtros</Typography>
            <Box>
              <IconButton onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                <FilterListIcon />
              </IconButton>
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          {mostrarFiltros && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Número de Orden"
                  value={filtros.numeroOrden}
                  onChange={(e) => handleFiltroChange('numeroOrden', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filtros.estado}
                    label="Estado"
                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    {Object.entries(ESTADOS_ORDEN).map(([key, estado]) => (
                      <MenuItem key={key} value={key}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fecha Desde"
                  type="date"
                  value={filtros.fechaDesde || ''}
                  onChange={(e) => handleFiltroChange('fechaDesde', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fecha Hasta"
                  type="date"
                  value={filtros.fechaHasta || ''}
                  onChange={(e) => handleFiltroChange('fechaHasta', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleResetFiltros} variant="outlined" size="small">
                  Limpiar Filtros
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* Tabla de órdenes */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Órdenes de Pedido ({paginacion.total})
          </Typography>
          
          {ordenes.length === 0 ? (
            <Box textAlign="center" py={4}>
              <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No hay órdenes de pedido
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Genere nuevas órdenes o ajuste los filtros
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
                      <Box display="flex" gap={1} mr={2}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopiarOrden(orden);
                          }}
                          title="Copiar orden"
                          color="secondary"
                        >
                          <CopyIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarOrden(orden);
                          }}
                          title="Eliminar"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
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

          {/* Paginación */}
          {paginacion.totalPaginas > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={paginacion.totalPaginas}
                page={paginacion.pagina}
                onChange={handleCambiarPagina}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialogo de confirmación de eliminación */}
      <Dialog open={dialogoEliminar} onClose={() => setDialogoEliminar(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro que desea eliminar la orden de pedido{' '}
            <strong>{ordenAEliminar?.numeroOrden || `#${ordenAEliminar?.id}`}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoEliminar(false)}>Cancelar</Button>
          <Button onClick={confirmarEliminar} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de confirmación de copia */}
      <Dialog open={dialogoCopiar} onClose={() => setDialogoCopiar(false)}>
        <DialogTitle>Copiar Orden de Pedido</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Desea copiar la orden de pedido{' '}
            <strong>{ordenACopiar?.numeroOrden || `#${ordenACopiar?.id}`}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Se creará una nueva orden con los mismos items, que podrá modificar antes de enviar.
          </Typography>
          {ordenACopiar && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Detalles de la orden a copiar:
              </Typography>
              <Typography variant="body2">
                <strong>Proveedor:</strong> {ordenACopiar.proveedor?.nombre || 'Sin proveedor'}
              </Typography>
              <Typography variant="body2">
                <strong>Items:</strong> {ordenACopiar.items?.length || 0}
              </Typography>
              <Typography variant="body2">
                <strong>Valor Total:</strong> {formatearMoneda(ordenACopiar.valorTotal)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoCopiar(false)}>Cancelar</Button>
          <Button onClick={confirmarCopiar} color="primary" variant="contained">
            Copiar Orden
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
