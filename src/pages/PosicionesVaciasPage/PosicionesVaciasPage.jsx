import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Chip, 
  CircularProgress, 
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LocationOn, 
  Storage, 
  Grid3x3, 
  FilterList, 
  FileDownload,
  Assessment,
  GetApp
} from '@mui/icons-material';
import { usePosicionesVacias } from '../../features/stock/hooks/usePosicionesVacias';
import { useOcupacionDeposito } from '../../features/stock/hooks/useOcupacionDeposito';
import { useMovimientosInternosPesados } from '../../features/movimientos/hooks/useMovimientosInternosPesados';
import { 
  exportPosicionesVaciasToExcel, 
  exportEstadisticasPosicionesToExcel 
} from '../../shared/utils/excelExporter';
import OccupationProgressCircle from '../../shared/ui/OccupationProgressCircle';
import MovimientosInternosPesadosCard from '../../shared/ui/MovimientosInternosPesadosCard';
import './PosicionesVaciasPage.css';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  cursor: 'pointer',
}));

const PosicionesVaciasPage = () => {
  const {
    posicionesVacias,
    loading,
    error,
    stats,
    cargarPosicionesVacias,
    formatearPosicion,
    obtenerColorTipo,
    obtenerIconoTipo,
    valoresUnicos
  } = usePosicionesVacias();

  const {
    estadisticas: estadisticasOcupacion,
    loading: loadingOcupacion,
    error: errorOcupacion,
    recargarEstadisticas: recargarOcupacion
  } = useOcupacionDeposito();

  const {
    estadisticas: estadisticasMovimientos,
    loading: loadingMovimientos,
    error: errorMovimientos,
    recargarEstadisticas: recargarMovimientos
  } = useMovimientosInternosPesados();

  // Estados para los filtros
  const [filtroRack, setFiltroRack] = useState('');
  const [filtroFila, setFiltroFila] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('');
  const [filtroPasillo, setFiltroPasillo] = useState('');

  // Filtrar posiciones según los criterios seleccionados
  const posicionesFiltradas = useMemo(() => {
    return posicionesVacias.filter(posicion => {
      if (filtroRack && posicion.rack !== parseInt(filtroRack)) return false;
      if (filtroFila && posicion.fila !== parseInt(filtroFila)) return false;
      if (filtroNivel && posicion.AB !== filtroNivel) return false;
      if (filtroPasillo && posicion.numeroPasillo !== parseInt(filtroPasillo)) return false;
      return true;
    });
  }, [posicionesVacias, filtroRack, filtroFila, filtroNivel, filtroPasillo]);

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroRack('');
    setFiltroFila('');
    setFiltroNivel('');
    setFiltroPasillo('');
  };

  // Función para exportar posiciones vacías a Excel
  const handleExportarPosiciones = () => {
    try {
      const resultado = exportPosicionesVaciasToExcel(posicionesVacias, posicionesFiltradas);
      if (resultado.exito) {
        // Mostrar mensaje de éxito (puedes usar SweetAlert2 si está disponible)
        console.log(`✅ ${resultado.mensaje}`);
        alert(`✅ ${resultado.mensaje}`);
      } else {
        console.error(`❌ ${resultado.mensaje}`);
        alert(`❌ ${resultado.mensaje}`);
      }
    } catch (error) {
      console.error('❌ Error al exportar posiciones:', error);
      alert('❌ Error al exportar las posiciones vacías');
    }
  };

  // Función para exportar estadísticas a Excel
  const handleExportarEstadisticas = () => {
    try {
      const resultado = exportEstadisticasPosicionesToExcel(stats, valoresUnicos);
      if (resultado.exito) {
        console.log(`✅ ${resultado.mensaje}`);
        alert(`✅ ${resultado.mensaje}`);
      } else {
        console.error(`❌ ${resultado.mensaje}`);
        alert(`❌ ${resultado.mensaje}`);
      }
    } catch (error) {
      console.error('❌ Error al exportar estadísticas:', error);
      alert('❌ Error al exportar las estadísticas');
    }
  };

  const obtenerIconoTipoComponent = (posicion) => {
    const iconType = obtenerIconoTipo(posicion);
    switch (iconType) {
      case 'grid3x3':
        return <Grid3x3 />;
      case 'storage':
        return <Storage />;
      case 'location_on':
        return <LocationOn />;
      default:
        return <LocationOn />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar las posiciones vacías: {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          📦 Posiciones Vacías
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Depósito - Inventario de Espacios Disponibles
        </Typography>
      </Box>

      {/* Contador Grande de Posiciones Cargadas */}
      <Box className="contador-grande">
        <Typography variant="h1" component="div" className="numero-grande">
          {posicionesVacias.length}
        </Typography>
        <Typography variant="h5" component="div">
          Posiciones Vacías Cargadas
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
          Total de espacios disponibles en el depósito
        </Typography>
        
        {/* Botón de Exportación Principal */}
        <Box sx={{ mt: 3 }}>
          <Tooltip title="Exportar todas las posiciones vacías a Excel para imprimir">
            <Button
              variant="contained"
              color="success"
              startIcon={<GetApp />}
              onClick={handleExportarPosiciones}
              size="large"
              sx={{ 
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              📊 Exportar a Excel para Imprimir
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div">
                {stats.total}
              </Typography>
              <Typography variant="body2">
                Total Posiciones Vacías
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div">
                {estadisticasOcupacion?.totalPosiciones || 0}
              </Typography>
              <Typography variant="body2">
                Total Posiciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div">
                {stats.pasillo}
              </Typography>
              <Typography variant="body2">
                Sistema Pasillo
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div">
                {stats.entrada}
              </Typography>
              <Typography variant="body2">
                Entrada
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Nuevas Visualizaciones */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Círculo de Ocupación del Depósito */}
        <Grid item xs={12} md={6}>
          <OccupationProgressCircle
            estadisticas={estadisticasOcupacion}
            loading={loadingOcupacion}
            error={errorOcupacion}
          />
        </Grid>

        {/* Movimientos Internos Pesados */}
        <Grid item xs={12} md={6}>
          <MovimientosInternosPesadosCard
            estadisticas={estadisticasMovimientos}
            loading={loadingMovimientos}
            error={errorMovimientos}
            onRefresh={recargarMovimientos}
          />
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterList sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="primary">
            Filtros de Búsqueda
          </Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Rack</InputLabel>
              <Select
                value={filtroRack}
                label="Rack"
                onChange={(e) => setFiltroRack(e.target.value)}
              >
                <MenuItem value="">Todos los racks</MenuItem>
                {valoresUnicos?.racks?.map(rack => (
                  <MenuItem key={rack} value={rack}>Rack {rack}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Fila</InputLabel>
              <Select
                value={filtroFila}
                label="Fila"
                onChange={(e) => setFiltroFila(e.target.value)}
              >
                <MenuItem value="">Todas las filas</MenuItem>
                {valoresUnicos?.filas?.map(fila => (
                  <MenuItem key={fila} value={fila}>Fila {fila}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Nivel</InputLabel>
              <Select
                value={filtroNivel}
                label="Nivel"
                onChange={(e) => setFiltroNivel(e.target.value)}
              >
                <MenuItem value="">Todos los niveles</MenuItem>
                {valoresUnicos?.niveles?.map(nivel => (
                  <MenuItem key={nivel} value={nivel}>Nivel {nivel}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Pasillo</InputLabel>
              <Select
                value={filtroPasillo}
                label="Pasillo"
                onChange={(e) => setFiltroPasillo(e.target.value)}
              >
                <MenuItem value="">Todos los pasillos</MenuItem>
                {valoresUnicos?.pasillos?.map(pasillo => (
                  <MenuItem key={pasillo} value={pasillo}>Pasillo {pasillo}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={`Resultados: ${posicionesFiltradas.length} de ${posicionesVacias.length}`}
            color="info"
            variant="outlined"
          />
          <Chip
            label="Limpiar Filtros"
            onClick={limpiarFiltros}
            color="secondary"
            variant="outlined"
            clickable
          />
          
          {/* Botones de Exportación */}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Tooltip title="Exportar posiciones vacías a Excel">
              <Button
                variant="contained"
                color="success"
                startIcon={<FileDownload />}
                onClick={handleExportarPosiciones}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Exportar Posiciones
              </Button>
            </Tooltip>
            
            <Tooltip title="Exportar estadísticas a Excel">
              <Button
                variant="outlined"
                color="info"
                startIcon={<Assessment />}
                onClick={handleExportarEstadisticas}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Exportar Estadísticas
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Lista de Posiciones */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Lista de Posiciones Vacías Filtradas ({posicionesFiltradas.length})
        </Typography>
      </Box>

      {posicionesFiltradas.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {posicionesVacias.length === 0 
            ? 'No hay posiciones vacías en este momento. Todas las posiciones tienen stock disponible.'
            : 'No hay posiciones que coincidan con los filtros seleccionados. Intenta ajustar los criterios de búsqueda.'
          }
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {posicionesFiltradas.map((posicion) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={posicion.id}>
              <StyledCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ color: 'primary.main', mr: 1 }}>
                      {obtenerIconoTipoComponent(posicion)}
                    </Box>
                    <Chip 
                      label={formatearPosicion(posicion)}
                      color={obtenerColorTipo(posicion)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      ID: {posicion.id.substring(0, 8)}...
                    </Typography>
                    
                    {posicion.rack && (
                      <Typography variant="body2" color="text.secondary">
                        Rack: {posicion.rack} | Fila: {posicion.fila} | Nivel: {posicion.AB}
                      </Typography>
                    )}
                    
                    {posicion.numeroPasillo && (
                      <Typography variant="body2" color="text.secondary">
                        Pasillo: {posicion.numeroPasillo}
                      </Typography>
                    )}
                    
                    {posicion.entrada && (
                      <Typography variant="body2" color="text.secondary">
                        Tipo: Entrada
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Botón de Recarga */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Chip
          label="🔄 Recargar Posiciones"
          onClick={cargarPosicionesVacias}
          color="primary"
          variant="outlined"
          clickable
          sx={{ cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );
};

export default PosicionesVaciasPage;
