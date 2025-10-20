import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import axios from 'axios';
import { API_CONFIG } from '../../../../config/api';

const ConsultarRemitosSalidaTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estados para filtros
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [categoriaMaterial, setCategoriaMaterial] = useState('');
  const [materialEspecifico, setMaterialEspecifico] = useState('');
  const [cliente, setCliente] = useState('');
  
  // Estados para datos
  const [categorias, setCategorias] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [totales, setTotales] = useState({ kilos: 0, unidades: 0 });
  
  // Estados para UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Cargar categorías y materiales al montar el componente
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      // Cargar datos desde la API existente
      const [salidasResponse, proveedoresResponse] = await Promise.all([
        axios.get(`${API_CONFIG.BASE_URL}/movimientos/salida`),
        axios.get(`${API_CONFIG.BASE_URL}/proveedores`)
      ]);
      
      // Extraer categorías y materiales únicos de los datos de salida
      const categoriasUnicas = new Set();
      const materialesUnicos = new Set();
      const clientesUnicos = new Set();
      
      salidasResponse.data.forEach(remito => {
        remito.items.forEach(item => {
          if (item.categoria) categoriasUnicas.add(item.categoria);
          if (item.descripcion) materialesUnicos.add(item.descripcion);
        });
        if (remito.proveedor) clientesUnicos.add(remito.proveedor);
      });
      
      setCategorias(Array.from(categoriasUnicas).map(cat => ({ nombre: cat })));
      setMateriales(Array.from(materialesUnicos).map(mat => ({ nombre: mat })));
      setClientes(Array.from(clientesUnicos).map(cliente => ({ nombre: cliente })));
      
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      // Usar datos de ejemplo si falla la API
      setCategorias([
        { nombre: 'Materia Prima' },
        { nombre: 'Producto Terminado' },
        { nombre: 'Insumos' }
      ]);
      
      setMateriales([
        { nombre: 'Acero' },
        { nombre: 'Plástico' },
        { nombre: 'Producto A' }
      ]);
      
      setClientes([
        { nombre: 'Cliente A' },
        { nombre: 'Cliente B' },
        { nombre: 'Cliente C' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!fechaDesde || !fechaHasta) {
      setError('Por favor selecciona las fechas de inicio y fin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Usar el endpoint existente con filtros de fecha
      const params = new URLSearchParams({
        fechaDesde,
        fechaHasta
      });

      const response = await axios.get(`${API_CONFIG.BASE_URL}/movimientos/salida-ultima-semana?${params}`);
      const salidasData = response.data;

      // Aplicar filtros adicionales en el frontend
      let resultadosFiltrados = salidasData;

      // Filtrar por cliente
      if (cliente) {
        resultadosFiltrados = resultadosFiltrados.filter(grupo => 
          grupo.proveedor && grupo.proveedor.toLowerCase().includes(cliente.toLowerCase())
        );
      }

      // Transformar datos para la tabla
      const resultadosTransformados = [];
      let totalKilos = 0;
      let totalUnidades = 0;

      resultadosFiltrados.forEach(grupo => {
        grupo.remitos.forEach(remito => {
          remito.items.forEach(item => {
            // Aplicar filtros de material
            let incluirItem = true;
            
            if (categoriaMaterial && item.categoria !== categoriaMaterial) {
              incluirItem = false;
            }
            
            if (materialEspecifico && !item.descripcion.toLowerCase().includes(materialEspecifico.toLowerCase())) {
              incluirItem = false;
            }

            if (incluirItem) {
              resultadosTransformados.push({
                fecha: grupo.fecha,
                numeroRemito: remito.numeroRemito,
                material: item.descripcion,
                categoria: item.categoria,
                kilos: item.kilos,
                unidades: item.unidades,
                cliente: grupo.proveedor,
                partida: item.partida
              });
              
              totalKilos += item.kilos || 0;
              totalUnidades += item.unidades || 0;
            }
          });
        });
      });

      setResultados(resultadosTransformados);
      setTotales({ kilos: totalKilos, unidades: totalUnidades });
      
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error buscando remitos:', error);
      setError('Error al buscar remitos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
    setCategoriaMaterial('');
    setMaterialEspecifico('');
    setCliente('');
    setResultados([]);
    setTotales({ kilos: 0, unidades: 0 });
    setSearchPerformed(false);
    setError(null);
  };

  const handleExportar = () => {
    // Implementar exportación a Excel
    console.log('Exportando datos...');
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filtros de Búsqueda
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Fecha Desde"
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Fecha Hasta"
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    label="Cliente"
                  >
                    <MenuItem value="">Todos los clientes</MenuItem>
                    {clientes.map((cli, index) => (
                      <MenuItem key={index} value={cli.nombre}>
                        {cli.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Categoría de Material</InputLabel>
                  <Select
                    value={categoriaMaterial}
                    onChange={(e) => setCategoriaMaterial(e.target.value)}
                    label="Categoría de Material"
                  >
                    <MenuItem value="">Todas las categorías</MenuItem>
                    {categorias.map((cat, index) => (
                      <MenuItem key={index} value={cat.nombre}>
                        {cat.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Material Específico</InputLabel>
                  <Select
                    value={materialEspecifico}
                    onChange={(e) => setMaterialEspecifico(e.target.value)}
                    label="Material Específico"
                  >
                    <MenuItem value="">Todos los materiales</MenuItem>
                    {materiales.map((mat, index) => (
                      <MenuItem key={index} value={mat.nombre}>
                        {mat.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleBuscar}
                disabled={loading || !fechaDesde || !fechaHasta}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Buscar'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={handleLimpiarFiltros}
                disabled={loading}
              >
                Limpiar Filtros
              </Button>
              
              {searchPerformed && resultados.length > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportar}
                  color="success"
                >
                  Exportar Excel
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Resumen de Totales */}
        {searchPerformed && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Resumen de Totales
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {resultados.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Remitos Encontrados
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 700 }}>
                      {totales.kilos.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Kilos
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 700 }}>
                      {totales.unidades}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Unidades
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 700 }}>
                      {totales.kilos > 0 ? (totales.kilos / resultados.length).toFixed(2) : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Promedio Kilos/Remito
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Mensajes de Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabla de Resultados */}
        {searchPerformed && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Resultados de la Búsqueda
              </Typography>
              
              {resultados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron remitos con los filtros seleccionados
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>N° Remito</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Material</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Partida</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Kilos</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Unidades</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resultados.map((remito, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            {new Date(remito.fecha).toLocaleDateString('es-ES')}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={remito.numeroRemito} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{remito.cliente}</TableCell>
                          <TableCell>{remito.material}</TableCell>
                          <TableCell>
                            <Chip 
                              label={remito.categoria} 
                              size="small" 
                              color="secondary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {remito.partida || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {remito.kilos.toFixed(2)} kg
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {remito.unidades}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
  );
};

export default ConsultarRemitosSalidaTab;
