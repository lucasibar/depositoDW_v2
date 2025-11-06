import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import PageNavigationMenu from '../../components/PageNavigationMenu';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { useRemitosSalida } from '../../hooks/useRemitosSalida';
import { authService } from '../../services/authService';

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const formatFechaHora = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const RemitosSalidaPage = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const {
    remitos,
    loading,
    error,
    obtenerRemitosSalida,
    eliminarItemRemito
  } = useRemitosSalida();

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const [dialogEliminarOpen, setDialogEliminarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    
    // Establecer fechas por defecto (últimos 30 días)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    const fechaDesdeStr = hace30Dias.toISOString().split('T')[0];
    const fechaHastaStr = hoy.toISOString().split('T')[0];
    
    setFechaDesde(fechaDesdeStr);
    setFechaHasta(fechaHastaStr);
    
    obtenerRemitosSalida(fechaDesdeStr, fechaHastaStr);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  const handleBuscar = () => {
    if (fechaDesde && fechaHasta) {
      obtenerRemitosSalida(fechaDesde, fechaHasta);
    } else {
      setSnackbar({
        open: true,
        message: 'Por favor selecciona ambas fechas',
        severity: 'warning'
      });
    }
  };

  const handleEliminarClick = (item) => {
    setItemAEliminar(item);
    setDialogEliminarOpen(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!itemAEliminar) return;
    
    setEliminando(true);
    const resultado = await eliminarItemRemito(itemAEliminar.id, fechaDesde, fechaHasta);
    setEliminando(false);
    
    if (resultado.ok) {
      setSnackbar({
        open: true,
        message: 'Registro eliminado correctamente',
        severity: 'success'
      });
      setDialogEliminarOpen(false);
      setItemAEliminar(null);
    } else {
      setSnackbar({
        open: true,
        message: resultado.error || 'Error al eliminar el registro',
        severity: 'error'
      });
    }
  };

  const handleCancelarEliminar = () => {
    setDialogEliminarOpen(false);
    setItemAEliminar(null);
  };

  // Los remitos ya vienen agrupados por fecha y proveedor desde el hook
  // Solo necesitamos ordenarlos y formatear
  const remitosAgrupados = useMemo(() => {
    return remitos.map(grupo => ({
      ...grupo,
      fechaFormateada: formatFecha(grupo.fecha)
    })).sort((a, b) => {
      const fechaCompare = new Date(b.fecha) - new Date(a.fecha);
      if (fechaCompare !== 0) return fechaCompare;
      return a.proveedorNombre.localeCompare(b.proveedorNombre);
    });
  }, [remitos]);

  const calcularTotalKilos = (items) => {
    return items.reduce((total, item) => total + (item.kilos || 0), 0).toFixed(2);
  };

  const calcularTotalUnidades = (items) => {
    return items.reduce((total, item) => total + (item.unidades || 0), 0);
  };

  return (
    <AppLayout user={user} onLogout={handleLogout} pageTitle="Remitos de Salida">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Remitos de Salida
          </Typography>
          <PageNavigationMenu user={user} currentPath={location.pathname} />
        </Box>

        {/* Filtros de fecha */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Fecha Desde"
              type="date"
              size="small"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <TextField
              label="Fecha Hasta"
              type="date"
              size="small"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="contained"
              startIcon={<DateRangeIcon />}
              onClick={handleBuscar}
              disabled={loading}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => obtenerRemitosSalida(fechaDesde, fechaHasta)}
              disabled={loading}
            >
              Actualizar
            </Button>
          </Box>
        </Paper>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Lista de remitos */}
        {!loading && !error && remitos.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No se encontraron remitos de salida en el rango de fechas seleccionado
            </Typography>
          </Paper>
        )}

        {!loading && !error && remitosAgrupados.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {remitosAgrupados.map((grupo, grupoIndex) => (
              <Box key={`${grupo.fecha}_${grupo.proveedor}_${grupoIndex}`}>
                {/* Header del grupo */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'primary.main', color: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {grupo.fechaFormateada}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Cliente: {grupo.proveedorNombre}
                  </Typography>
                </Paper>

                {/* Items del grupo */}
                <Card sx={{ overflow: 'hidden' }}>
                  <CardContent>
                    {/* Resumen del grupo */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={`Items: ${grupo.items?.length || 0}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Total Kilos: ${calcularTotalKilos(grupo.items || [])}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        <Chip
                          label={`Total Unidades: ${calcularTotalUnidades(grupo.items || [])}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Tabla de items */}
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Partida</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Kilos</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Unidades</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>N° Remito</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Acción</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {grupo.items?.map((item, index) => (
                            <TableRow key={item.id || index}>
                              <TableCell>
                                {item.item?.descripcion || item.item?.nombre || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {item.partida?.numeroPartida || 'N/A'}
                              </TableCell>
                              <TableCell align="right">
                                {item.kilos?.toFixed(2) || '0.00'}
                              </TableCell>
                              <TableCell align="right">
                                {item.unidades || 0}
                              </TableCell>
                              <TableCell>
                                {item.numeroRemito || '-'}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleEliminarClick(item)}
                                  title="Eliminar registro"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}

        {/* Dialog de confirmación de eliminación */}
        <Dialog open={dialogEliminarOpen} onClose={handleCancelarEliminar}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar este registro?
            </Typography>
            {itemAEliminar && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Item:</Typography>
                <Typography variant="body2">
                  {itemAEliminar.item?.descripcion || itemAEliminar.item?.nombre || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>Partida:</Typography>
                <Typography variant="body2">
                  {itemAEliminar.partida?.numeroPartida || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>Kilos:</Typography>
                <Typography variant="body2">
                  {itemAEliminar.kilos?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Esta acción eliminará el movimiento y generará el movimiento contrapuesto correspondiente usando el proveedor del item.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelarEliminar} disabled={eliminando}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarEliminar}
              color="error"
              variant="contained"
              disabled={eliminando}
            >
              {eliminando ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  );
};

export default RemitosSalidaPage;

