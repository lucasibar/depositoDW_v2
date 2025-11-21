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
  Download as DownloadIcon
} from '@mui/icons-material';
import { authService } from '../../services/auth/authService';
import { dashboardComprasService } from '../../services/dashboardComprasService';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import PageNavigationMenu from '../../components/PageNavigationMenu';
import { useLocation } from 'react-router-dom';
import ModernCard from '../../shared/ui/ModernCard/ModernCard';
import { DashboardComprasCard } from '../../components/DashboardComprasCard/DashboardComprasCard';
import { ConfiguracionTarjetaModal } from '../../components/ConfiguracionTarjetaModal/ConfiguracionTarjetaModal';
import * as XLSX from 'xlsx';

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
  const [descargandoFiltrado, setDescargandoFiltrado] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
      cargarDashboard();
    }
  }, []);

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
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
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

  const handleDescargarStockFiltrado = async () => {
    try {
      setDescargandoFiltrado(true);
      const response = await dashboardComprasService.descargarReporteStockExcel();
      
      if (!response.success || !response.data) {
        throw new Error('Error en la respuesta del servidor');
      }
      
      // Filtrar solo registros con Número de Partida de 11 o más dígitos
      const datosFiltrados = response.data.filter(item => {
        const numeroPartida = item.numeroPartida || '';
        // Contar solo dígitos en el número de partida
        const digitos = numeroPartida.replace(/\D/g, '').length;
        return digitos >= 11;
      });
      
      // Preparar datos para Excel
      const datosExcel = datosFiltrados.map(item => ({
        'Descripción del Item': item.itemDescripcion,
        'Número de Partida': item.numeroPartida,
        'Proveedor': item.proveedor,
        'Posición': item.posicion,
        'Kilos': item.kilos,
        'Unidades': item.unidades
      }));
      
      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(datosExcel);
      
      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 50 }, // Descripción del Item
        { wch: 20 }, // Número de Partida
        { wch: 30 }, // Proveedor
        { wch: 40 }, // Posición
        { wch: 15 }, // Kilos
        { wch: 15 }  // Unidades
      ];
      ws['!cols'] = colWidths;
      
      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Stock Filtrado');
      
      // HOJA 1: Resumen por partida y posición
      const resumenPorPartidaPosicion = {};
      datosFiltrados.forEach(item => {
        const numeroPartida = item.numeroPartida || 'Sin partida';
        const posicion = item.posicion || 'Sin posición';
        const key = `${numeroPartida}_${posicion}`;
        
        if (!resumenPorPartidaPosicion[key]) {
          resumenPorPartidaPosicion[key] = {
            numeroPartida: numeroPartida,
            posicion: posicion,
            descripcion: item.itemDescripcion || 'Sin descripción',
            material: item.itemDescripcion ? item.itemDescripcion.split(' - ')[0] : 'Sin material',
            kilosTotales: 0,
            unidadesTotales: 0,
            cantidadRegistros: 0
          };
        }
        
        resumenPorPartidaPosicion[key].kilosTotales += parseFloat(item.kilos) || 0;
        resumenPorPartidaPosicion[key].unidadesTotales += parseInt(item.unidades) || 0;
        resumenPorPartidaPosicion[key].cantidadRegistros += 1;
      });
      
      // Convertir a array y ordenar por kilos totales (descendente)
      const resumenPartidaPosicionArray = Object.values(resumenPorPartidaPosicion)
        .sort((a, b) => b.kilosTotales - a.kilosTotales);
      
      // HOJA 2: Resumen por partida y combinación de material + descripción
      const resumenPorPartidaMaterialDescripcion = {};
      datosFiltrados.forEach(item => {
        const numeroPartida = item.numeroPartida || 'Sin partida';
        const material = item.itemDescripcion ? item.itemDescripcion.split(' - ')[0] : 'Sin material';
        const descripcion = item.itemDescripcion || 'Sin descripción';
        const key = `${numeroPartida}_${material}_${descripcion}`;
        
        if (!resumenPorPartidaMaterialDescripcion[key]) {
          resumenPorPartidaMaterialDescripcion[key] = {
            numeroPartida: numeroPartida,
            material: material,
            descripcion: descripcion,
            kilosTotales: 0,
            unidadesTotales: 0,
            cantidadRegistros: 0
          };
        }
        
        resumenPorPartidaMaterialDescripcion[key].kilosTotales += parseFloat(item.kilos) || 0;
        resumenPorPartidaMaterialDescripcion[key].unidadesTotales += parseInt(item.unidades) || 0;
        resumenPorPartidaMaterialDescripcion[key].cantidadRegistros += 1;
      });
      
      // Convertir a array y ordenar por kilos totales (descendente)
      const resumenPartidaMaterialDescripcionArray = Object.values(resumenPorPartidaMaterialDescripcion)
        .sort((a, b) => b.kilosTotales - a.kilosTotales);
      
      // Preparar datos para la hoja 1: Por partida y posición
      const datosHoja1 = resumenPartidaPosicionArray.map(item => ({
        'Número de Partida': item.numeroPartida,
        'Posición': item.posicion,
        'Material': item.material,
        'Descripción': item.descripcion,
        'Kilos Totales': item.kilosTotales,
        'Unidades Totales': item.unidadesTotales,
        'Cantidad de Registros': item.cantidadRegistros
      }));
      
      // Preparar datos para la hoja 2: Por partida y combinación material + descripción
      const datosHoja2 = resumenPartidaMaterialDescripcionArray.map(item => ({
        'Número de Partida': item.numeroPartida,
        'Material': item.material,
        'Descripción': item.descripcion,
        'Kilos Totales': item.kilosTotales,
        'Unidades Totales': item.unidadesTotales,
        'Cantidad de Registros': item.cantidadRegistros
      }));
      
      // Crear hoja 1: Por partida y posición
      const wsHoja1 = XLSX.utils.json_to_sheet(datosHoja1);
      
      // Ajustar ancho de columnas para la hoja 1
      const colWidthsHoja1 = [
        { wch: 25 }, // Número de Partida
        { wch: 40 }, // Posición
        { wch: 30 }, // Material
        { wch: 50 }, // Descripción
        { wch: 20 }, // Kilos Totales
        { wch: 20 }, // Unidades Totales
        { wch: 25 }  // Cantidad de Registros
      ];
      wsHoja1['!cols'] = colWidthsHoja1;
      
      // Crear hoja 2: Por partida y material
      const wsHoja2 = XLSX.utils.json_to_sheet(datosHoja2);
      
      // Ajustar ancho de columnas para la hoja 2
      const colWidthsHoja2 = [
        { wch: 25 }, // Número de Partida
        { wch: 30 }, // Material
        { wch: 50 }, // Descripción
        { wch: 20 }, // Kilos Totales
        { wch: 20 }, // Unidades Totales
        { wch: 25 }  // Cantidad de Registros
      ];
      wsHoja2['!cols'] = colWidthsHoja2;
      
      // Agregar hojas al libro
      XLSX.utils.book_append_sheet(wb, wsHoja1, 'Por Partida y Posicion');
      XLSX.utils.book_append_sheet(wb, wsHoja2, 'Por Partida y Material-Desc');
      
      // Generar archivo Excel
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // Crear blob y descargar
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generar nombre de archivo con fecha actual
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `reporte-importaciones-${fecha}.xlsx`;
      
      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      window.URL.revokeObjectURL(url);
      
      setSnackbar({
        open: true,
        message: `Reporte de importaciones descargado exitosamente (${datosFiltrados.length} registros) - Incluye resumen por partida y posición, y por partida y combinación material-descripción`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error descargando reporte filtrado:', error);
      setSnackbar({
        open: true,
        message: 'Error al descargar el reporte de importaciones',
        severity: 'error'
      });
    } finally {
      setDescargandoFiltrado(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Dashboard de Compras">
      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Header */}
        {!isMobile && (
          <Box sx={{ 
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DashboardIcon sx={{ fontSize: '2.5rem', color: 'primary.main' }} />
              <Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    mb: 0.5
                  }}
                >
                  Dashboard de Compras
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'var(--color-text-secondary)',
                    fontSize: '1.1rem'
                  }}
                >
                  Stock consolidado de materiales por categoría
                </Typography>
              </Box>
            </Box>
            <PageNavigationMenu user={user} currentPath={location.pathname} />
          </Box>
        )}

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
              disabled={descargando || descargandoFiltrado || loading}
              sx={{ borderRadius: 2 }}
            >
              {descargando ? 'Descargando...' : 'Descargar Stock'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDescargarStockFiltrado}
              disabled={descargando || descargandoFiltrado || loading}
              sx={{ borderRadius: 2 }}
            >
              {descargandoFiltrado ? 'Descargando...' : 'Importaciones'}
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

        {/* Modal de configuración */}
        <ConfiguracionTarjetaModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          tarjeta={tarjetaSeleccionada}
          onConfiguracionGuardada={handleConfiguracionGuardada}
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
