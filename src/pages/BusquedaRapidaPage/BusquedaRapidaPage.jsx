import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon, Menu as MenuIcon } from '@mui/icons-material';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { useAuth } from '../../hooks/useAuth';
import { busquedaRapidaService } from '../../features/busquedaRapida/busquedaRapidaService';
import PageNavigationMenu from '../../components/PageNavigationMenu/PageNavigationMenu';

const BusquedaRapidaPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const carouselRef = useRef(null);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [itemsProveedor, setItemsProveedor] = useState([]);
  const [itemBuscado, setItemBuscado] = useState(null);
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);
  const [cargandoItems, setCargandoItems] = useState(false);
  const [cargandoKilos, setCargandoKilos] = useState({});
  const [busquedasRealizadas, setBusquedasRealizadas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

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
    setCurrentIndex(0); // Mostrar la búsqueda más reciente
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

  // Funciones para el carrusel móvil
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    setCurrentIndex((prevIndex) => {
      if (isLeftSwipe && prevIndex < busquedasRealizadas.length - 1) {
        return prevIndex + 1;
      }
      if (isRightSwipe && prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  }, [busquedasRealizadas.length]);

  useEffect(() => {
    if (carouselRef.current && isMobile) {
      const carousel = carouselRef.current;
      carousel.addEventListener('touchstart', onTouchStart, { passive: true });
      carousel.addEventListener('touchmove', onTouchMove, { passive: true });
      carousel.addEventListener('touchend', onTouchEnd, { passive: true });

      return () => {
        carousel.removeEventListener('touchstart', onTouchStart);
        carousel.removeEventListener('touchmove', onTouchMove);
        carousel.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [isMobile, onTouchStart, onTouchMove, onTouchEnd]);

  useEffect(() => {
    if (busquedasRealizadas.length > 0 && currentIndex >= busquedasRealizadas.length) {
      setCurrentIndex(busquedasRealizadas.length - 1);
    }
  }, [busquedasRealizadas.length, currentIndex]);

  if (isLoading || !user) {
    return null;
  }

  // Vista móvil
  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'background.default'
        }}
      >
        {/* Barra superior blanca con título y menú */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: 'white',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar sx={{ minHeight: '48px !important', px: 1.5 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Búsqueda Rápida
            </Typography>
            <PageNavigationMenu user={user} currentPath="/depositoDW_v2/busqueda-rapida" />
          </Toolbar>
        </AppBar>

        {/* Sección de búsqueda compacta pegada a la barra */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderBottom: '1px solid',
            borderColor: 'divider',
            p: 1,
            pt: 1.5
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <FormControl size="small" sx={{ flex: 1, minWidth: 0 }}>
              <InputLabel>Proveedor</InputLabel>
              <Select
                value={proveedorSeleccionado}
                onChange={(e) => setProveedorSeleccionado(e.target.value)}
                label="Proveedor"
                disabled={cargandoProveedores}
              >
                {cargandoProveedores ? (
                  <MenuItem disabled>
                    <CircularProgress size={16} />
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

            <Autocomplete
              size="small"
              options={itemsProveedor}
              getOptionLabel={(option) => {
                if (!option) return '';
                const categoria = option.categoria || '';
                const descripcion = option.descripcion || '';
                return `${categoria} - ${descripcion}`;
              }}
              filterOptions={(options, { inputValue }) => {
                if (!inputValue || inputValue.trim() === '') {
                  return options;
                }
                const searchText = inputValue.toLowerCase().trim();
                
                if (searchText.length < 2) {
                  return options;
                }
                
                const filtered = options.filter((option) => {
                  if (!option) return false;
                  
                  const categoria = (option.categoria || '').toLowerCase();
                  const descripcion = (option.descripcion || '').toLowerCase();
                  const codigoInterno = (option.codigoInterno || '').toLowerCase();
                  const codigoProveedor = (option.codigoProveedor || '').toLowerCase();
                  
                  const matchDescripcion = descripcion.includes(searchText);
                  const matchCategoria = categoria.includes(searchText);
                  
                  const matchCodigoInterno = codigoInterno && (
                    codigoInterno === searchText || 
                    (searchText.length >= 3 && codigoInterno.includes(searchText))
                  );
                  const matchCodigoProveedor = codigoProveedor && (
                    codigoProveedor === searchText || 
                    (searchText.length >= 3 && codigoProveedor.includes(searchText))
                  );
                  
                  return matchDescripcion || matchCategoria || matchCodigoInterno || matchCodigoProveedor;
                });
                return filtered;
              }}
              value={itemBuscado}
              onChange={(event, newValue) => setItemBuscado(newValue)}
              loading={cargandoItems}
              disabled={!proveedorSeleccionado || cargandoItems}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Material"
                  placeholder="Buscar..."
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {cargandoItems ? <CircularProgress size={16} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {option.categoria || 'Sin categoría'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.descripcion || 'Sin descripción'}
                    </Typography>
                  </Box>
                </Box>
              )}
              sx={{ flex: 2, minWidth: 0 }}
            />

            <Button
              variant="contained"
              size="small"
              onClick={handleAgregarMaterial}
              disabled={!itemBuscado}
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              <SearchIcon fontSize="small" />
            </Button>
          </Box>

          {materialesSeleccionados.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {materialesSeleccionados.map((material, index) => (
                  <Chip
                    key={`${material.item.id}-${material.proveedor.id}-${index}`}
                    label={`${material.item.descripcion.substring(0, 15)}... ${material.kilos.toFixed(1)}kg`}
                    onDelete={() =>
                      handleEliminarMaterial(material.item.id, material.proveedor.id)
                    }
                    deleteIcon={<DeleteIcon />}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleRealizarBusqueda}
            disabled={materialesSeleccionados.length === 0}
            fullWidth
            sx={{ mt: 0.5 }}
          >
            Buscar
          </Button>
        </Box>

        {/* Carrusel de búsquedas */}
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'background.default'
          }}
        >
            {busquedasRealizadas.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  p: 3
                }}
              >
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  No hay búsquedas realizadas aún.
                  <br />
                  Realiza una búsqueda para ver los resultados aquí.
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  ref={carouselRef}
                  sx={{
                    display: 'flex',
                    height: '100%',
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: 'transform 0.3s ease-in-out',
                    willChange: 'transform'
                  }}
                >
                  {busquedasRealizadas.map((busqueda) => (
                    <Box
                      key={busqueda.id}
                      sx={{
                        minWidth: '100%',
                        width: '100%',
                        p: 2,
                        boxSizing: 'border-box'
                      }}
                    >
                      <Card
                        elevation={3}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <CardContent sx={{ flex: 1, overflow: 'auto' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              {busqueda.fecha}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {currentIndex + 1} / {busquedasRealizadas.length}
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
                                <Box sx={{ flex: 1, mr: 1 }}>
                                  <Typography variant="body2" fontWeight="bold" noWrap>
                                    {material.item.descripcion}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" noWrap>
                                    {material.proveedor.nombre}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right', minWidth: '80px' }}>
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
                                    sx={{ mt: 0.5, minWidth: 'auto', p: 0.5, fontSize: '0.7rem' }}
                                  >
                                    {cargandoKilos[material.item.id] ? (
                                      <CircularProgress size={14} />
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
                    </Box>
                  ))}
                </Box>

                {/* Indicadores de página */}
                {busquedasRealizadas.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 1,
                      zIndex: 20
                    }}
                  >
                    {busquedasRealizadas.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor:
                            index === currentIndex ? 'primary.main' : 'rgba(0,0,0,0.2)',
                          transition: 'background-color 0.3s'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
        </Box>
      </Box>
    );
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
                getOptionLabel={(option) => {
                  if (!option) return '';
                  const categoria = option.categoria || '';
                  const descripcion = option.descripcion || '';
                  return `${categoria} - ${descripcion}`;
                }}
                filterOptions={(options, { inputValue }) => {
                  if (!inputValue || inputValue.trim() === '') {
                    return options;
                  }
                  const searchText = inputValue.toLowerCase().trim();
                  
                  // Si el texto de búsqueda es muy corto (menos de 2 caracteres), no filtrar
                  if (searchText.length < 2) {
                    return options;
                  }
                  
                  const filtered = options.filter((option) => {
                    if (!option) return false;
                    
                    const categoria = (option.categoria || '').toLowerCase();
                    const descripcion = (option.descripcion || '').toLowerCase();
                    const codigoInterno = (option.codigoInterno || '').toLowerCase();
                    const codigoProveedor = (option.codigoProveedor || '').toLowerCase();
                    
                    // Priorizar búsqueda en descripción y categoría
                    const matchDescripcion = descripcion.includes(searchText);
                    const matchCategoria = categoria.includes(searchText);
                    
                    // Solo buscar en códigos si el texto es más largo o si coincide exactamente
                    const matchCodigoInterno = codigoInterno && (
                      codigoInterno === searchText || 
                      (searchText.length >= 3 && codigoInterno.includes(searchText))
                    );
                    const matchCodigoProveedor = codigoProveedor && (
                      codigoProveedor === searchText || 
                      (searchText.length >= 3 && codigoProveedor.includes(searchText))
                    );
                    
                    // Priorizar coincidencias en descripción y categoría
                    return matchDescripcion || matchCategoria || matchCodigoInterno || matchCodigoProveedor;
                  });
                  return filtered;
                }}
                value={itemBuscado}
                onChange={(event, newValue) => setItemBuscado(newValue)}
                loading={cargandoItems}
                disabled={!proveedorSeleccionado || cargandoItems}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar Material"
                    placeholder="Buscar por material o descripción..."
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
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {option.categoria || 'Sin categoría'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.descripcion || 'Sin descripción'}
                      </Typography>
                    </Box>
                  </Box>
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
