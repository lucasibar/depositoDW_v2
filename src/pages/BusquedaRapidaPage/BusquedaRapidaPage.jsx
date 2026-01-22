import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Autocomplete,
  Paper
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { busquedaRapidaService } from '../../features/busquedaRapida/busquedaRapidaService';

const BusquedaRapidaPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [itemsProveedor, setItemsProveedor] = useState([]);
  const [itemBuscado, setItemBuscado] = useState(null);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);
  const [cargandoItems, setCargandoItems] = useState(false);
  const [cargandoKilos, setCargandoKilos] = useState({});
  const [busquedasRealizadas, setBusquedasRealizadas] = useState([]);

  useEffect(() => {
    if (!isLoading && user) {
      cargarProveedores();
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (proveedorSeleccionado) {
      cargarItemsProveedor(proveedorSeleccionado);
    } else {
      setItemsProveedor([]);
    }
  }, [proveedorSeleccionado]);

  const cargarProveedores = async () => {
    setCargandoProveedores(true);
    try {
      const data = await busquedaRapidaService.obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    } finally {
      setCargandoProveedores(false);
    }
  };

  const cargarItemsProveedor = async (idProveedor) => {
    setCargandoItems(true);
    try {
      const data = await busquedaRapidaService.obtenerItemsPorProveedor(idProveedor);
      setItemsProveedor(data);
    } catch (error) {
      console.error('Error al cargar items:', error);
    } finally {
      setCargandoItems(false);
    }
  };

  const cargarKilosItem = async (itemId) => {
    setCargandoKilos(prev => ({ ...prev, [itemId]: true }));
    try {
      const kilos = await busquedaRapidaService.obtenerKilosItem(itemId);
      return kilos;
    } catch (error) {
      console.error('Error al cargar kilos:', error);
      return 0;
    } finally {
      setCargandoKilos(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleAgregarMaterial = async () => {
    if (!itemBuscado) return;

    const itemExistente = materialesSeleccionados.find(
      m => m.item.id === itemBuscado.id && m.proveedor.id === proveedorSeleccionado
    );

    if (itemExistente) {
      return;
    }

    const proveedor = proveedores.find(p => p.id === proveedorSeleccionado);
    const kilos = await cargarKilosItem(itemBuscado.id);

    const nuevoMaterial = {
      item: itemBuscado,
      proveedor: proveedor,
      kilos: kilos
    };

    setMaterialesSeleccionados([...materialesSeleccionados, nuevoMaterial]);
    setItemBuscado(null);
  };

  const handleEliminarMaterial = (itemId, proveedorId) => {
    setMaterialesSeleccionados(
      materialesSeleccionados.filter(
        m => !(m.item.id === itemId && m.proveedor.id === proveedorId)
      )
    );
  };

  const handleRealizarBusqueda = async () => {
    if (materialesSeleccionados.length === 0) return;

    const busqueda = {
      id: Date.now().toString(),
      fecha: new Date().toLocaleString(),
      materiales: [...materialesSeleccionados]
    };

    setBusquedasRealizadas([busqueda, ...busquedasRealizadas]);
    setMaterialesSeleccionados([]);
    setProveedorSeleccionado('');
    setItemBuscado(null);
  };

  const handleActualizarKilos = async (itemId, busquedaId = null) => {
    const kilos = await cargarKilosItem(itemId);
    
    if (busquedaId) {
      // Actualizar kilos en una búsqueda realizada
      setBusquedasRealizadas(
        busquedasRealizadas.map(busqueda =>
          busqueda.id === busquedaId
            ? {
                ...busqueda,
                materiales: busqueda.materiales.map(m =>
                  m.item.id === itemId ? { ...m, kilos } : m
                )
              }
            : busqueda
        )
      );
    } else {
      // Actualizar kilos en materiales seleccionados
      setMaterialesSeleccionados(
        materialesSeleccionados.map(m =>
          m.item.id === itemId ? { ...m, kilos } : m
        )
      );
    }
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <AppLayout
      user={user}
      pageTitle="Búsqueda Rápida"
      onLogout={() => navigate('/depositoDW_v2/')}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Búsqueda Rápida de Materiales
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Seleccionar Materiales
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Proveedor</InputLabel>
                <Select
                  value={proveedorSeleccionado}
                  onChange={(e) => setProveedorSeleccionado(e.target.value)}
                  label="Proveedor"
                  disabled={cargandoProveedores}
                >
                  {cargandoProveedores ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    proveedores.map((proveedor) => (
                      <MenuItem key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={itemsProveedor}
                getOptionLabel={(option) => option.descripcion || ''}
                value={itemBuscado}
                onChange={(event, newValue) => setItemBuscado(newValue)}
                loading={cargandoItems}
                disabled={!proveedorSeleccionado || cargandoItems}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar Material"
                    placeholder="Seleccione un material"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {cargandoItems ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAgregarMaterial}
                disabled={!itemBuscado}
                startIcon={<SearchIcon />}
                sx={{ height: '56px' }}
              >
                Agregar
              </Button>
            </Grid>
          </Grid>

          {materialesSeleccionados.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                Materiales Seleccionados:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {materialesSeleccionados.map((material, index) => (
                  <Chip
                    key={`${material.item.id}-${material.proveedor.id}-${index}`}
                    label={`${material.item.descripcion} (${material.proveedor.nombre}) - ${material.kilos.toFixed(2)} kg`}
                    onDelete={() =>
                      handleEliminarMaterial(material.item.id, material.proveedor.id)
                    }
                    deleteIcon={<DeleteIcon />}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={handleRealizarBusqueda}
            disabled={materialesSeleccionados.length === 0}
            fullWidth
            sx={{ mt: 2 }}
          >
            Realizar Búsqueda
          </Button>
        </Paper>

        {busquedasRealizadas.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Búsquedas Realizadas
            </Typography>
            <Grid container spacing={2}>
              {busquedasRealizadas.map((busqueda) => (
                <Grid item xs={12} md={6} lg={4} key={busqueda.id}>
                  <Card elevation={3}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          {busqueda.fecha}
                        </Typography>
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        Materiales: {busqueda.materiales.length}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {busqueda.materiales.map((material, index) => (
                          <Box
                            key={`${material.item.id}-${index}`}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              borderRadius: 1,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {material.item.descripcion}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {material.proveedor.nombre}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="primary"
                              >
                                {material.kilos.toFixed(2)} kg
                              </Typography>
                              <Button
                                size="small"
                                onClick={() => handleActualizarKilos(material.item.id, busqueda.id)}
                                disabled={cargandoKilos[material.item.id]}
                                sx={{ mt: 0.5, minWidth: 'auto', p: 0.5 }}
                              >
                                {cargandoKilos[material.item.id] ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  'Actualizar'
                                )}
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Kilos:
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {busqueda.materiales
                            .reduce((sum, m) => sum + m.kilos, 0)
                            .toFixed(2)}{' '}
                          kg
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </AppLayout>
  );
};

export default BusquedaRapidaPage;
