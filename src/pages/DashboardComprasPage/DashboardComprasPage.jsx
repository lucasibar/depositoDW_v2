import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Fab,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Download as DownloadIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import { authService } from '../../services/auth/authService';
import { dashboardComprasService } from '../../services/dashboardComprasService';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { useLocation } from 'react-router-dom';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { DashboardComprasCard } from '../../components/DashboardComprasCard/DashboardComprasCard';
import { ConfiguracionTarjetaModal } from '../../components/ConfiguracionTarjetaModal/ConfiguracionTarjetaModal';
import { StockPorPartidaTable } from '../../components/StockPorPartidaTable/StockPorPartidaTable';
import { SeleccionProveedoresModal } from '../../components/SeleccionProveedoresModal/SeleccionProveedoresModal';
import * as XLSX from 'xlsx';
import { FilterList as FilterIcon } from '@mui/icons-material';

export const DashboardComprasPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [tarjetas, setTarjetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [descargando, setDescargando] = useState(false);

  // Nuevos estados para la lista agrupada
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState([]);
  const [stockAgrupado, setStockAgrupado] = useState([]);
  const [loadingAgrupado, setLoadingAgrupado] = useState(false);
  const [modalProveedoresOpen, setModalProveedoresOpen] = useState(false);

  // Estados para exclusiones
  const [exclusiones, setExclusiones] = useState([]);
  const [modalExclusionesOpen, setModalExclusionesOpen] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
      cargarDashboard();
      cargarFiltrosYStock();
      cargarExclusiones();
    }
  }, []);

  const cargarExclusiones = async () => {
    try {
      const data = await dashboardComprasService.obtenerExclusiones();
      setExclusiones(data);
    } catch (error) {
      console.error('Error cargando exclusiones:', error);
    }
  };

  const cargarFiltrosYStock = async () => {
    try {
      setLoadingAgrupado(true);
      const ids = await dashboardComprasService.obtenerFiltros();
      setProveedoresSeleccionados(ids);
      if (ids && ids.length > 0) {
        const stock = await dashboardComprasService.obtenerStockPorProveedores(ids);
        setStockAgrupado(stock);
      }
    } catch (error) {
      console.error('Error cargando filtros persistidos:', error);
    } finally {
      setLoadingAgrupado(false);
    }
  };

  const handleExcluir = async (material, descripcion) => {
    try {
      await dashboardComprasService.excluirItem(material, descripcion);
      await cargarExclusiones();
      setSnackbar({ open: true, message: 'Item excluido permanentemente', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al excluir item', severity: 'error' });
    }
  };

  const handleRestaurar = async (id) => {
    try {
      await dashboardComprasService.restaurarItem(id);
      await cargarExclusiones();
      setSnackbar({ open: true, message: 'Item restaurado', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al restaurar item', severity: 'error' });
    }
  };

  // Filtrar stockAgrupado según las exclusiones
  const stockFiltrado = stockAgrupado.filter(item => {
    return !exclusiones.some(ex =>
      ex.material === item.material && ex.descripcion === item.descripcion
    );
  });

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardComprasService.obtenerDashboard();
      setTarjetas(data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
      setError('Error al cargar el dashboard de compras');
    } finally {
      setLoading(false);
    }
  };

  const handleTarjetaClick = (tarjeta) => {
    console.log('Tarjeta clickeada:', tarjeta);
    // Aquí se puede agregar lógica adicional al hacer clic en la tarjeta
  };

  const handleConfigClick = (tarjeta) => {
    setTarjetaSeleccionada(tarjeta);
    setModalOpen(true);
  };

  const handleConfiguracionGuardada = (tarjetaId, itemIds) => {
    // Actualizar la tarjeta localmente
    setTarjetas(prev => prev.map(tarjeta =>
      tarjeta.id === tarjetaId
        ? { ...tarjeta, itemIds }
        : tarjeta
    ));

    setSnackbar({
      open: true,
      message: 'Configuración guardada exitosamente',
      severity: 'success'
    });

    // Recargar el dashboard para obtener el stock actualizado
    setTimeout(() => {
      cargarDashboard();
    }, 1000);
  };

  const handleRefresh = () => {
    cargarDashboard();
    cargarFiltrosYStock();
  };

  const handleProveedoresGuardados = async (ids) => {
    setProveedoresSeleccionados(ids);
    try {
      setLoadingAgrupado(true);
      const stock = await dashboardComprasService.obtenerStockPorProveedores(ids);
      setStockAgrupado(stock);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al cargar stock por proveedores',
        severity: 'error'
      });
    } finally {
      setLoadingAgrupado(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
  };

  const handleDescargarAgrupadoExcel = () => {
    try {
      if (!stockFiltrado || stockFiltrado.length === 0) {
        setSnackbar({
          open: true,
          message: 'No hay datos para exportar. Selecciona proveedores primero.',
          severity: 'warning'
        });
        return;
      }

      // Preparar datos normalizados para Excel
      const materialNames = {
        'algodon': 'Algodón',
        'algodon-color': 'Algodón Color',
        'nylon': 'Nylon',
        'nylon-color': 'Nylon Color',
        'laicra': 'Lycra',
        'lycra': 'Lycra',
        'goma': 'Goma',
        'costura': 'Costura'
      };

      const formatMaterialName = (id) => {
        if (materialNames[id]) return materialNames[id];
        return id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, ' ');
      };

      const datosExcel = stockFiltrado.map(row => ({
        'Material': formatMaterialName(row.material),
        'Descripción': row.descripcion || '',
        'Proveedor': row.proveedorNombre,
        'Partida': row.numeroPartida,
        'Kilos Totales': Number(row.totalKilos),
        'Unidades Totales (Cajas)': Number(row.totalCajas)
      }));

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExcel);

      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 15 }, // Material
        { wch: 40 }, // Descripción
        { wch: 30 }, // Proveedor
        { wch: 20 }, // Partida
        { wch: 15 }, // Kilos
        { wch: 20 }  // Unidades
      ];
      ws['!cols'] = colWidths;

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Importaciones');

      // Generar archivo Excel
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `importaciones-agrupadas-${fecha}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Reporte de importaciones descargado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error exportando Excel:', error);
      setSnackbar({
        open: true,
        message: 'Error al exportar a Excel',
        severity: 'error'
      });
    }
  };

  const handleDescargarStock = async () => {
    try {
      setDescargando(true);
      const response = await dashboardComprasService.descargarReporteStockExcel();

      if (!response.success || !response.data) {
        throw new Error('Error en la respuesta del servidor');
      }

      // Función para extraer componentes de la posición
      const extraerComponentesPosicion = (posicion) => {
        if (!posicion) {
          return { rack: '', fila: '', pasillo: '', nivel: '' };
        }

        console.log('Procesando posición:', posicion); // Debug

        // Inicializar valores
        let rack = '';
        let fila = '';
        let pasillo = '';
        let nivel = '';

        // Buscar Rack con formato "Rack: X"
        const rackMatch = posicion.match(/Rack:\s*(\d+)/i);
        if (rackMatch) {
          rack = rackMatch[1];
        }

        // Buscar Fila con formato "Fila: X"
        const filaMatch = posicion.match(/Fila:\s*([A-Za-z0-9]+)/i);
        if (filaMatch) {
          fila = filaMatch[1];
        }

        // Buscar Nivel con formato "Nivel: X"
        const nivelMatch = posicion.match(/Nivel:\s*([A-Za-z0-9]+)/i);
        if (nivelMatch) {
          nivel = nivelMatch[1];
        }

        // Buscar Pasillo con formato "Pasillo: X"
        const pasilloMatch = posicion.match(/Pasillo:\s*(\d+)/i);
        if (pasilloMatch) {
          pasillo = pasilloMatch[1];
        }

        console.log('Componentes extraídos:', { rack, fila, pasillo, nivel }); // Debug

        return { rack, fila, pasillo, nivel };
      };

      // Preparar datos para Excel
      const datosExcel = response.data.map(item => {
        const componentes = extraerComponentesPosicion(item.posicion);

        return {
          'Descripción del Item': item.itemDescripcion,
          'Número de Partida': item.numeroPartida,
          'Proveedor': item.proveedor,
          'Rack': componentes.rack,
          'Fila': componentes.fila,
          'Pasillo': componentes.pasillo,
          'Nivel (AB)': componentes.nivel,
          'Kilos': item.kilos,
          'Unidades': item.unidades
        };
      });

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExcel);

      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 50 }, // Descripción del Item
        { wch: 20 }, // Número de Partida
        { wch: 30 }, // Proveedor
        { wch: 10 }, // Rack
        { wch: 10 }, // Fila
        { wch: 10 }, // Pasillo
        { wch: 12 }, // Nivel (AB)
        { wch: 15 }, // Kilos
        { wch: 15 }  // Unidades
      ];
      ws['!cols'] = colWidths;

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Stock');

      // Generar archivo Excel
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Crear blob y descargar
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generar nombre de archivo con fecha actual
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `reporte-stock-${fecha}.xlsx`;

      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Reporte de stock descargado exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error descargando reporte:', error);
      setSnackbar({
        open: true,
        message: 'Error al descargar el reporte de stock',
        severity: 'error'
      });
    } finally {
      setDescargando(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Dashboard de Compras">
      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Contenido principal */}
        <ModernCard
          title={isMobile ? undefined : "Stock de Materiales"}
          subtitle={isMobile ? undefined : "Visualiza el stock total de cada tipo de material"}
          padding={isMobile ? "compact" : "normal"}
          sx={{ mb: isMobile ? 2 : 4 }}
        >
          {/* Botones de acción */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mb: 3
          }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDescargarStock}
              disabled={descargando || loading}
              sx={{ borderRadius: 2 }}
            >
              {descargando ? 'Descargando...' : 'Descargar Stock'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Actualizar
            </Button>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading ? (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={48} />
              <Typography variant="body1" color="text.secondary">
                Cargando dashboard...
              </Typography>
            </Box>
          ) : (
            /* Grid de tarjetas */
            <Grid container spacing={isMobile ? 2 : 3}>
              {tarjetas.length === 0 ? (
                <Grid item xs={12}>
                  <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    color: 'text.secondary'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      No hay tarjetas configuradas
                    </Typography>
                    <Typography variant="body2">
                      Ejecuta el script de inicialización para crear las tarjetas por defecto
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                tarjetas.map((tarjeta) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={tarjeta.id}>
                    <DashboardComprasCard
                      tarjeta={tarjeta}
                      onClick={handleTarjetaClick}
                      onConfigClick={handleConfigClick}
                      isLoading={loading}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </ModernCard>

        {/* Nueva sección: Stock por Partida */}
        <ModernCard
          title="Stock Detallado por Partida"
          subtitle="Materiales agrupados por partida de los proveedores seleccionados"
          padding={isMobile ? "compact" : "normal"}
        >
          {/* Resumen de Totales por Item (Material + Descripción) */}
          {!loadingAgrupado && stockFiltrado.length > 0 && (
            <Box sx={{ mb: 4, p: 2, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Resumen de Totales por Item
                </Typography>
                <Tooltip title="Gestionar items ocultos">
                  <IconButton size="small" onClick={() => setModalExclusionesOpen(true)}>
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Grid container spacing={2}>
                {(() => {
                  // Calcular colores por categoría
                  const getColor = (cat) => {
                    const c = cat?.toLowerCase() || '';
                    if (c.includes('algodon')) return '#4CAF50';
                    if (c.includes('nylon')) return '#2196F3';
                    if (c.includes('lycra') || c.includes('laicra')) return '#9C27B0';
                    if (c.includes('goma')) return '#FF9800';
                    return '#757575';
                  };

                  // Agrupar stockFiltrado por material + descripcion para las cartitas
                  const summaryGroups = stockFiltrado.reduce((acc, item) => {
                    const key = `${item.material}_${item.descripcion}`;
                    if (!acc[key]) {
                      acc[key] = {
                        material: item.material,
                        descripcion: item.descripcion,
                        totalKilos: 0,
                        totalCajas: 0
                      };
                    }
                    acc[key].totalKilos += Number(item.totalKilos);
                    acc[key].totalCajas += Number(item.totalCajas);
                    return acc;
                  }, {});

                  return Object.values(summaryGroups).map((group, idx) => {
                    const color = getColor(group.material);
                    return (
                      <Grid item xs={12} sm={6} md={3} key={`card-${idx}`}>
                        <Box sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'background.paper',
                          borderLeft: `4px solid ${color}`,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative',
                          '&:hover .excluir-btn': { opacity: 1 }
                        }}>
                          <Tooltip title="Ocultar de este reporte">
                            <IconButton
                              className="excluir-btn"
                              size="small"
                              onClick={() => handleExcluir(group.material, group.descripcion)}
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                bgcolor: 'rgba(255,255,255,0.8)',
                                '&:hover': { bgcolor: 'error.light', color: 'white' }
                              }}
                            >
                              <VisibilityOffIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: color, textTransform: 'uppercase', display: 'block' }}>
                              {group.material?.replace(/-/g, ' ')}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.2, fontSize: '0.85rem', pr: 3 }}>
                              {group.descripcion}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                              {group.totalKilos.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {group.totalCajas.toLocaleString()} unidades/cajas
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  });
                })()}
              </Grid>
            </Box>
          )}

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {exclusiones.length > 0 && (
              <Button
                variant="text"
                size="small"
                startIcon={<VisibilityOffIcon />}
                onClick={() => setModalExclusionesOpen(true)}
                sx={{ color: 'text.secondary' }}
              >
                Ver items ocultos ({exclusiones.length})
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDescargarAgrupadoExcel}
              disabled={loadingAgrupado || stockFiltrado.length === 0}
              sx={{ borderRadius: 2 }}
            >
              Descargar Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<FilterIcon />}
              onClick={() => setModalProveedoresOpen(true)}
              disabled={loadingAgrupado}
              sx={{ borderRadius: 2 }}
            >
              Seleccionar Proveedores
            </Button>
          </Box>

          <StockPorPartidaTable
            data={stockFiltrado}
            loading={loadingAgrupado}
          />
        </ModernCard>

        {/* Modal de configuración */}
        <ConfiguracionTarjetaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          tarjeta={tarjetaSeleccionada}
          onConfiguracionGuardada={handleConfiguracionGuardada}
        />

        {/* Modal de Exclusiones */}
        <Dialog
          open={modalExclusionesOpen}
          onClose={() => setModalExclusionesOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityOffIcon color="action" />
            Items Ocultos del Reporte
          </DialogTitle>
          <DialogContent dividers>
            {exclusiones.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No hay items ocultos actualmente.</Typography>
              </Box>
            ) : (
              <List>
                {exclusiones.map((ex) => (
                  <ListItem
                    key={ex.id}
                    secondaryAction={
                      <Tooltip title="Restaurar al reporte">
                        <IconButton edge="end" onClick={() => handleRestaurar(ex.id)} color="primary">
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={ex.descripcion}
                      secondary={ex.material?.toUpperCase().replace(/-/g, ' ')}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalExclusionesOpen(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal Seleccion de Proveedores */}
        <SeleccionProveedoresModal
          open={modalProveedoresOpen}
          onClose={() => setModalProveedoresOpen(false)}
          proveedoresSeleccionadosIniciales={proveedoresSeleccionados}
          onGuardar={handleProveedoresGuardados}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* FAB para acciones rápidas en móvil */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="refresh"
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <RefreshIcon />
          </Fab>
        )}
      </Container>
    </AppLayout>
  );
};
