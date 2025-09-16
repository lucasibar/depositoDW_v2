import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  SwapHoriz as SwapHorizIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Scale as ScaleIcon,
  Numbers as NumbersIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const MovimientosRecomendadosTab = ({ movimientosRecomendados, estadisticas, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterPrioridad, setFilterPrioridad] = useState('todos');
  const [expandedMovements, setExpandedMovements] = useState(new Set());
  
  // Estados para el modal de confirmación y ejecución de movimiento
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [executingMovement, setExecutingMovement] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const toggleExpanded = (movementId) => {
    const newExpanded = new Set(expandedMovements);
    if (newExpanded.has(movementId)) {
      newExpanded.delete(movementId);
    } else {
      newExpanded.add(movementId);
    }
    setExpandedMovements(newExpanded);
  };

  const filteredMovements = movimientosRecomendados?.filter(movement => {
    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        movement.item.descripcion.toLowerCase().includes(searchLower) ||
        movement.item.categoria.toLowerCase().includes(searchLower) ||
        movement.proveedor?.nombre?.toLowerCase().includes(searchLower) ||
        movement.partida.numeroPartida.toString().includes(searchLower) ||
        movement.razon.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Filtro por tipo
    if (filterTipo !== 'todos' && movement.tipo !== filterTipo) {
      return false;
    }

    // Filtro por prioridad
    if (filterPrioridad !== 'todos' && movement.prioridad !== filterPrioridad) {
      return false;
    }

    return true;
  }) || [];

  const getMovementsByType = (tipo) => {
    return movimientosRecomendados?.filter(m => m.tipo === tipo).length || 0;
  };

  const getMovementsByPriority = (prioridad) => {
    return movimientosRecomendados?.filter(m => m.prioridad === prioridad).length || 0;
  };

  const getTotalKilos = () => {
    return movimientosRecomendados?.reduce((total, movement) => total + movement.kilos, 0) || 0;
  };

  const getTotalUnidades = () => {
    return movimientosRecomendados?.reduce((total, movement) => total + movement.unidades, 0) || 0;
  };

  const formatPosition = (posicion) => {
    if (!posicion) return 'N/A';
    if (posicion.entrada) return 'ENTRADA';
    if (posicion.numeroPasillo) return `Pasillo ${posicion.numeroPasillo}`;
    return `Rack ${posicion.rack || ''}-${posicion.fila || ''}-${posicion.AB || ''}`;
  };

  const getPositionDescription = (posicion) => {
    if (!posicion) return 'Posición no disponible';
    if (posicion.entrada) return 'Área de Entrada del Depósito';
    if (posicion.numeroPasillo) return `Pasillo de Almacenamiento ${posicion.numeroPasillo}`;
    return `Rack ${posicion.rack}, Fila ${posicion.fila}, Nivel ${posicion.AB}`;
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baja': return 'info';
      default: return 'default';
    }
  };

  const getTypeColor = (tipo) => {
    switch (tipo) {
      case 'entrada_a_ideal': return 'success';
      case 'reorganizacion': return 'warning';
      default: return 'default';
    }
  };

  // Función para manejar el click en "MOVER A"
  const handleMoveClick = (movement) => {
    setSelectedMovement(movement);
    setConfirmDialogOpen(true);
  };

  // Función para confirmar y ejecutar el movimiento
  const handleConfirmMovement = async () => {
    if (!selectedMovement) return;

    setExecutingMovement(true);
    try {
      // Preparar los datos del movimiento usando la misma estructura que MovimientoInterno
      const movimientoData = {
        itemId: selectedMovement.item.id,
        partidaId: selectedMovement.partida.id,
        posicionOrigenId: selectedMovement.posicionOrigen.id,
        posicionDestinoId: selectedMovement.posicionDestino.id,
        kilos: selectedMovement.kilos,
        unidades: selectedMovement.unidades
      };

      console.log('Ejecutando movimiento recomendado:', movimientoData);

      // Llamar a la misma API que usa MovimientoInterno
      const response = await fetch('https://derwill-deposito-backend.onrender.com/movimientos/movimiento-interno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Movimiento ejecutado exitosamente:', result);

      setNotification({
        open: true,
        message: `Movimiento ejecutado correctamente: ${selectedMovement.item.descripcion} movido a ${formatPosition(selectedMovement.posicionDestino)}`,
        severity: 'success'
      });

      // Cerrar modal y refrescar datos
      setConfirmDialogOpen(false);
      setSelectedMovement(null);
      
      // Refrescar los datos para mostrar el estado actualizado
      if (onRefresh) {
        onRefresh();
      }

    } catch (error) {
      console.error('Error al ejecutar movimiento:', error);
      setNotification({
        open: true,
        message: `Error al ejecutar movimiento: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setExecutingMovement(false);
    }
  };

  // Función para cancelar el movimiento
  const handleCancelMovement = () => {
    setConfirmDialogOpen(false);
    setSelectedMovement(null);
  };

  // Función para cerrar notificación
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (!movimientosRecomendados || movimientosRecomendados.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No hay movimientos recomendados en este momento. El depósito está optimizado.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Resumen */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SwapHorizIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {movimientosRecomendados.length}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Movimientos Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getMovementsByType('entrada_a_ideal')}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Desde Entrada
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-warning)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RefreshIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getMovementsByType('reorganizacion')}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Reorganizaciones
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-error)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScaleIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getTotalKilos().toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Kilos Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar por item, categoría, proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Movimiento</InputLabel>
              <Select
                value={filterTipo}
                label="Tipo de Movimiento"
                onChange={(e) => setFilterTipo(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="entrada_a_ideal">Desde Entrada</MenuItem>
                <MenuItem value="reorganizacion">Reorganización</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={filterPrioridad}
                label="Prioridad"
                onChange={(e) => setFilterPrioridad(e.target.value)}
              >
                <MenuItem value="todos">Todas</MenuItem>
                <MenuItem value="alta">Alta</MenuItem>
                <MenuItem value="media">Media</MenuItem>
                <MenuItem value="baja">Baja</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => {
                setSearchTerm('');
                setFilterTipo('todos');
                setFilterPrioridad('todos');
              }}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Resumen de movimientos por tipo */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: 'var(--color-background)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Resumen de Movimientos Recomendados
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(76, 175, 80, 0.1)', 
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid rgba(76, 175, 80, 0.3)'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'success.main', mb: 1 }}>
                📦 Movimientos desde Entrada
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items que están en el área de entrada y deben moverse a sus posiciones ideales según su categoría.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main', mt: 1 }}>
                {getMovementsByType('entrada_a_ideal')} movimientos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(255, 152, 0, 0.1)', 
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid rgba(255, 152, 0, 0.3)'
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'warning.main', mb: 1 }}>
                🔄 Reorganizaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items que están en posiciones incorrectas y deben moverse a posiciones que coincidan con su categoría.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main', mt: 1 }}>
                {getMovementsByType('reorganizacion')} movimientos
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de movimientos */}
      {filteredMovements.map((movement, index) => (
        <Card key={index} sx={{ mb: 2, boxShadow: 'var(--shadow-sm)' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {movement.item.descripcion}
              </Typography>
              <Chip 
                label={movement.tipo === 'entrada_a_ideal' ? 'Desde Entrada' : 'Reorganización'} 
                size="small" 
                color={getTypeColor(movement.tipo)}
                variant="outlined" 
              />
              <Chip 
                label={movement.prioridad.toUpperCase()} 
                size="small" 
                color={getPriorityColor(movement.prioridad)}
                variant="filled" 
              />
            </Box>

            {/* Información de movimiento clara */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 1,
              p: 2,
              backgroundColor: 'var(--color-background)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flex: 1,
                p: 1,
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid rgba(244, 67, 54, 0.3)'
              }}>
                <LocationIcon fontSize="small" color="error" />
                <Box>
                  <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                    DESDE:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPosition(movement.posicionOrigen)}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="small"
                startIcon={<SwapHorizIcon />}
                onClick={() => handleMoveClick(movement)}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-dark)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                MOVER A
              </Button>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                flex: 1,
                p: 1,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: 'var(--border-radius-sm)',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}>
                <LocationIcon fontSize="small" color="success" />
                <Box>
                  <Typography variant="caption" color="success" sx={{ fontWeight: 600 }}>
                    HACIA:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPosition(movement.posicionDestino)}
                  </Typography>
                </Box>
              </Box>
            </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip 
                    label={movement.item.categoria} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    icon={<CategoryIcon />}
                  />
                  <Chip 
                    label={`${movement.kilos.toFixed(2)} kg`} 
                    size="small" 
                    color="secondary" 
                    variant="outlined" 
                    icon={<ScaleIcon />}
                  />
                  <Chip 
                    label={`${movement.unidades} unidades`} 
                    size="small" 
                    color="info" 
                    variant="outlined" 
                    icon={<NumbersIcon />}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {movement.razon}
                </Typography>
              </Box>
              
              <Tooltip title={expandedMovements.has(index) ? "Contraer" : "Expandir"}>
                <IconButton 
                  onClick={() => toggleExpanded(index)}
                  sx={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'white',
                    '&:hover': { backgroundColor: 'var(--color-primary-dark)' }
                  }}
                >
                  {expandedMovements.has(index) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Collapse in={expandedMovements.has(index)}>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                          📍 Posición Origen
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationIcon fontSize="small" color="error" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatPosition(movement.posicionOrigen)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {getPositionDescription(movement.posicionOrigen)}
                        </Typography>
                        {movement.posicionOrigen?.categoria_ideal && (
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={`Ideal para: ${movement.posicionOrigen.categoria_ideal}`} 
                              size="small" 
                              color="error" 
                              variant="outlined" 
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderColor: 'success.main' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                          🎯 Posición Destino
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationIcon fontSize="small" color="success" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatPosition(movement.posicionDestino)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {getPositionDescription(movement.posicionDestino)}
                        </Typography>
                        {movement.posicionDestino?.categoria_ideal && (
                          <Box sx={{ mt: 1 }}>
                            <Chip 
                              label={`Ideal para: ${movement.posicionDestino.categoria_ideal}`} 
                              size="small" 
                              color="success" 
                              variant="outlined" 
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Información de compatibilidad */}
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'rgba(33, 150, 243, 0.1)', 
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid rgba(33, 150, 243, 0.3)'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                    💡 Razón del Movimiento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movement.razon}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={`Item: ${movement.item.categoria}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Destino: ${movement.posicionDestino?.categoria_ideal}`} 
                      size="small" 
                      color="success" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Coincidencia: ${movement.item.categoria === movement.posicionDestino?.categoria_ideal ? '✅' : '❌'}`} 
                      size="small" 
                      color={movement.item.categoria === movement.posicionDestino?.categoria_ideal ? 'success' : 'error'} 
                      variant="filled" 
                    />
                  </Box>
                </Box>

                <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Detalles del Item</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Proveedor</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Partida</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Kilos</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Unidades</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {movement.item.descripcion}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {movement.item.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BusinessIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {movement.proveedor?.nombre || 'Sin proveedor'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {movement.partida.numeroPartida}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {movement.kilos.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {movement.unidades}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {filteredMovements.length === 0 && (searchTerm || filterTipo !== 'todos' || filterPrioridad !== 'todos') && (
        <Alert severity="info">
          No se encontraron movimientos que coincidan con los filtros aplicados.
        </Alert>
      )}

      {/* Modal de confirmación de movimiento */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={handleCancelMovement}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SwapHorizIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Confirmar Movimiento</Typography>
          </Box>
          <Button
            onClick={handleCancelMovement}
            sx={{ minWidth: 'auto', p: 0.5 }}
            disabled={executingMovement}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>

        <DialogContent>
          {selectedMovement && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ¿Estás seguro de que quieres mover esta mercadería?
                </Typography>
              </Alert>

              <Card sx={{ mb: 2, backgroundColor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Detalles del Movimiento
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Item:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedMovement.item.descripcion}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Categoría:
                      </Typography>
                      <Chip 
                        label={selectedMovement.item.categoria} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Partida:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {selectedMovement.partida.numeroPartida}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Kilos:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {selectedMovement.kilos} kg
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Unidades:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {selectedMovement.unidades} un
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                p: 2,
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flex: 1,
                  p: 1,
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}>
                  <LocationIcon fontSize="small" color="error" />
                  <Box>
                    <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                      DESDE:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPosition(selectedMovement.posicionOrigen)}
                    </Typography>
                  </Box>
                </Box>

                <SwapHorizIcon color="primary" />

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flex: 1,
                  p: 1,
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}>
                  <LocationIcon fontSize="small" color="success" />
                  <Box>
                    <Typography variant="caption" color="success" sx={{ fontWeight: 600 }}>
                      HACIA:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPosition(selectedMovement.posicionDestino)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Razón:</strong> {selectedMovement.razon}
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCancelMovement}
            disabled={executingMovement}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmMovement}
            disabled={executingMovement}
            variant="contained"
            startIcon={executingMovement ? <CircularProgress size={20} /> : <CheckIcon />}
            sx={{
              backgroundColor: 'var(--color-success)',
              '&:hover': {
                backgroundColor: 'var(--color-success-dark)'
              }
            }}
          >
            {executingMovement ? 'Ejecutando...' : 'Confirmar Movimiento'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovimientosRecomendadosTab;
