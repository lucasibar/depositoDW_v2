import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  SwapHoriz as SwapIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { apiClient } from '../../config/api';

const MovimientoInterno = ({ 
  open, 
  onClose, 
  itemSeleccionado, 
  posicionOrigen,
  onMovimientoCompletado 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    rack: '',
    fila: '',
    nivel: '',
    pasillo: '',
    cajas: '',
    kilos: '',
    unidades: ''
  });

  // Establecer valores iniciales y limpiar formulario cuando se abre
  useEffect(() => {
    if (open) {
      // Limpiar formulario al abrir
      setFormData({
        rack: '',
        fila: '',
        nivel: '',
        pasillo: '',
        cajas: '',
        kilos: '',
        unidades: ''
      });
      
      // Establecer valores iniciales de kilos y unidades
      if (itemSeleccionado && itemSeleccionado.totalKilos && itemSeleccionado.totalUnidades) {
        setFormData(prev => ({
          ...prev,
          kilos: itemSeleccionado.totalKilos.toString(),
          unidades: itemSeleccionado.totalUnidades.toString()
        }));
      }
    }
  }, [open, itemSeleccionado]);

  // Función para calcular kilos automáticamente basado en cajas
  const calcularKilosPorCajas = (cajas, totalKilos, totalUnidades) => {
    if (!cajas || !totalKilos || !totalUnidades || totalUnidades === 0) {
      return '';
    }
    
    const cajasNum = parseInt(cajas);
    if (cajasNum <= 0) return '';
    
    // Calcular kilos por caja: totalKilos / totalUnidades
    const kilosPorCaja = totalKilos / totalUnidades;
    
    // Calcular kilos totales para las cajas seleccionadas
    const kilosCalculados = kilosPorCaja * cajasNum;
    
    // Redondear a número entero
    return Math.round(kilosCalculados).toString();
  };

  const handleInputChange = (field, value) => {
    console.log('MovimientoInterno - handleInputChange:', field, value);
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field === 'pasillo') {
        // Si se selecciona pasillo, limpiar rack, fila y nivel
        newData.pasillo = value;
        newData.rack = '';
        newData.fila = '';
        newData.nivel = '';
      } else if (field === 'cajas') {
        // Si se cambia el número de cajas, calcular automáticamente los kilos
        newData.cajas = value;
        const kilosCalculados = calcularKilosPorCajas(
          value, 
          itemSeleccionado?.totalKilos, 
          itemSeleccionado?.totalUnidades
        );
        newData.kilos = kilosCalculados;
        newData.unidades = value; // Las unidades son iguales a las cajas
      } else {
        // Si se selecciona rack, fila o nivel, limpiar pasillo
        newData[field] = value;
        newData.pasillo = '';
      }
      
      console.log('MovimientoInterno - newData:', newData);
      return newData;
    });
  };

  const handleSubmit = async () => {
    console.log('MovimientoInterno - handleSubmit iniciado');
    console.log('MovimientoInterno - formData:', formData);
    
    // Validar que se haya seleccionado una posición
    const tienePasillo = formData.pasillo !== '';
    const tieneRack = formData.rack !== '' && formData.fila !== '' && formData.nivel !== '';
    
    if (!tienePasillo && !tieneRack) {
      setError('Debe seleccionar una posición de destino (pasillo O rack/fila/nivel)');
      return;
    }

    // Validar que se haya especificado cajas o kilos/unidades
    if (!formData.cajas && (!formData.kilos || !formData.unidades)) {
      setError('Debe especificar la cantidad de cajas o los kilos y unidades a mover');
      return;
    }

    // Si se especificaron cajas, validar que sean válidas
    if (formData.cajas) {
      const cajasNum = parseInt(formData.cajas);
      if (cajasNum <= 0) {
        setError('La cantidad de cajas debe ser mayor a 0');
        return;
      }
      if (cajasNum > itemSeleccionado.totalUnidades) {
        setError(`No puede mover más cajas de las disponibles (${itemSeleccionado.totalUnidades} cajas)`);
        return;
      }
    }

    // Validar kilos y unidades si se especificaron directamente
    if (formData.kilos && formData.unidades) {
      if (parseFloat(formData.kilos) <= 0 || parseInt(formData.unidades) <= 0) {
        setError('Los valores de kilos y unidades deben ser mayores a 0');
        return;
      }
    }

    if (itemSeleccionado.totalKilos && parseFloat(formData.kilos) > itemSeleccionado.totalKilos) {
      setError(`No puede mover más kilos de los disponibles (${itemSeleccionado.totalKilos} kg)`);
      return;
    }

    if (itemSeleccionado.totalUnidades && parseInt(formData.unidades) > itemSeleccionado.totalUnidades) {
      setError(`No puede mover más unidades de las disponibles (${itemSeleccionado.totalUnidades} un)`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Obtener la posición de destino
      let posicionDestino = null;
      console.log('MovimientoInterno - Buscando posición de destino con:', { tienePasillo, formData });
      
      if (tienePasillo) {
        console.log('MovimientoInterno - Buscando por pasillo:', formData.pasillo);
        const response = await apiClient.get(`/posiciones?numeroPasillo=${formData.pasillo}`);
        console.log('MovimientoInterno - Respuesta búsqueda pasillo:', response.data);
        posicionDestino = response.data[0];
      } else {
        console.log('MovimientoInterno - Buscando por rack/fila/nivel:', { rack: formData.rack, fila: formData.fila, nivel: formData.nivel });
        const response = await apiClient.get(`/posiciones?rack=${formData.rack}&fila=${formData.fila}&AB=${formData.nivel}`);
        console.log('MovimientoInterno - Respuesta búsqueda rack:', response.data);
        posicionDestino = response.data[0];
      }

      console.log('MovimientoInterno - Posición destino encontrada:', posicionDestino);

      if (!posicionDestino) {
        setError('No se encontró la posición de destino seleccionada');
        return;
      }

      // Verificar que la posición de destino no sea la misma que la de origen
      if (posicionDestino.id === posicionOrigen.id) {
        setError('La posición de destino no puede ser la misma que la posición de origen');
        return;
      }

      const movimientoData = {
        itemId: itemSeleccionado.item.id,
        partidaId: itemSeleccionado.partida.id,
        posicionOrigenId: posicionOrigen.id,
        posicionDestinoId: posicionDestino.id,
        kilos: parseFloat(formData.kilos),
        unidades: parseInt(formData.unidades)
      };

      console.log('MovimientoInterno - Datos enviados al backend:', movimientoData);
      console.log('MovimientoInterno - Posición origen:', posicionOrigen);
      console.log('MovimientoInterno - Posición destino:', posicionDestino);

      const response = await apiClient.post('/movimientos/movimiento-interno', movimientoData);
      
      setSuccess('Movimiento interno realizado correctamente');
      
      // Limpiar formulario
      setFormData({
        rack: '',
        fila: '',
        nivel: '',
        pasillo: '',
        cajas: '',
        kilos: '',
        unidades: ''
      });

      // Notificar al componente padre
      if (onMovimientoCompletado) {
        onMovimientoCompletado();
      }

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error al realizar movimiento interno:', error);
      setError(error.response?.data?.message || 'Error al realizar el movimiento interno');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      rack: '',
      fila: '',
      nivel: '',
      pasillo: '',
      cajas: '',
      kilos: '',
      unidades: ''
    });
    setError('');
    setSuccess('');
    onClose();
  };

  const getPosicionDisplay = (posicion) => {
    if (!posicion) {
      return 'Posición no disponible';
    }
    
    // Si tiene número de pasillo, es una posición de pasillo
    if (posicion.numeroPasillo) {
      return `Pasillo ${posicion.numeroPasillo}`;
    }
    
    // Si tiene rack, fila y nivel, es una posición de rack
    if (posicion.rack && posicion.fila && posicion.AB) {
      return `Rack ${posicion.rack} - Fila ${posicion.fila} - Nivel ${posicion.AB}`;
    }
    
    // Si tiene rack y fila pero no nivel
    if (posicion.rack && posicion.fila) {
      return `Rack ${posicion.rack} - Fila ${posicion.fila}`;
    }
    
    // Si solo tiene rack
    if (posicion.rack) {
      return `Rack ${posicion.rack}`;
    }
    
    return 'Posición sin identificar';
  };

  // Generar opciones para los selectores
  const racks = Array.from({ length: 20 }, (_, i) => i + 1);
  const filas = Array.from({ length: 14 }, (_, i) => i + 1);
  const niveles = ['A', 'B'];
  const pasillos = Array.from({ length: 11 }, (_, i) => i + 1);

  // Debug logs
  console.log('MovimientoInterno - Props:', { open, itemSeleccionado, posicionOrigen });
  console.log('MovimientoInterno - FormData:', formData);

  // No renderizar si no hay datos necesarios
  if (!itemSeleccionado || !posicionOrigen) {
    console.log('MovimientoInterno - No renderizando porque faltan datos');
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SwapIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Movimiento Interno</Typography>
        </Box>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 'auto', p: 0.5 }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* Información del item y posición de origen */}
        <Card sx={{ mb: 3, backgroundColor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Información del Item
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Item:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {itemSeleccionado?.item?.categoria} - {itemSeleccionado?.item?.descripcion}
                </Typography>
              </Grid>
              
                             <Grid item xs={12} md={6}>
                 <Typography variant="body2" color="text.secondary">
                   Proveedor:
                 </Typography>
                 <Typography variant="body1" sx={{ fontWeight: 600 }}>
                   {itemSeleccionado?.proveedor?.nombre || 'N/A'}
                 </Typography>
               </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Partida:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {itemSeleccionado?.partida?.numeroPartida}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Posición de Origen:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {getPosicionDisplay(posicionOrigen)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Stock Disponible (Kilos):
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {itemSeleccionado?.totalKilos} kg
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Stock Disponible (Unidades):
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {itemSeleccionado?.totalUnidades} un
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        {/* Formulario de movimiento */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Detalles del Movimiento
        </Typography>

        {/* Información sobre cálculo automático */}
        {itemSeleccionado?.totalKilos && itemSeleccionado?.totalUnidades && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Cálculo automático:</strong> Si especificas la cantidad de cajas, 
              los kilos se calcularán automáticamente. 
              Kilos por caja: {(itemSeleccionado.totalKilos / itemSeleccionado.totalUnidades).toFixed(2)} kg
            </Typography>
          </Alert>
        )}

                <Grid container spacing={2}>
          {/* Selector de Pasillo */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pasillo</InputLabel>
                             <Select
                 value={formData.pasillo || ''}
                 onChange={(e) => handleInputChange('pasillo', e.target.value)}
                 disabled={loading || (formData.rack !== '' || formData.fila !== '' || formData.nivel !== '')}
               >
                <MenuItem value="">
                  <em>Selecciona un pasillo</em>
                </MenuItem>
                {pasillos.map((pasillo) => (
                  <MenuItem key={pasillo} value={pasillo}>
                    Pasillo {pasillo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Selector de Rack */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Rack</InputLabel>
                             <Select
                 value={formData.rack || ''}
                 onChange={(e) => handleInputChange('rack', e.target.value)}
                 disabled={loading || formData.pasillo !== ''}
               >
                <MenuItem value="">
                  <em>Rack</em>
                </MenuItem>
                {racks.map((rack) => (
                  <MenuItem key={rack} value={rack}>
                    {rack}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Selector de Fila */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Fila</InputLabel>
                             <Select
                 value={formData.fila || ''}
                 onChange={(e) => handleInputChange('fila', e.target.value)}
                 disabled={loading || formData.pasillo !== ''}
               >
                <MenuItem value="">
                  <em>Fila</em>
                </MenuItem>
                {filas.map((fila) => (
                  <MenuItem key={fila} value={fila}>
                    {fila}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Selector de Nivel */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Nivel</InputLabel>
                             <Select
                 value={formData.nivel || ''}
                 onChange={(e) => handleInputChange('nivel', e.target.value)}
                 disabled={loading || formData.pasillo !== ''}
               >
                <MenuItem value="">
                  <em>Nivel</em>
                </MenuItem>
                {niveles.map((nivel) => (
                  <MenuItem key={nivel} value={nivel}>
                    {nivel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cantidad de Cajas"
              type="number"
              value={formData.cajas || ''}
              onChange={(e) => handleInputChange('cajas', e.target.value)}
              disabled={loading}
              inputProps={{ 
                min: 0, 
                max: itemSeleccionado?.totalUnidades || 0
              }}
              helperText={`Máximo disponible: ${itemSeleccionado?.totalUnidades || 0} cajas`}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Kilos a Mover"
              type="number"
              value={formData.kilos || ''}
              onChange={(e) => handleInputChange('kilos', e.target.value)}
              disabled={loading || formData.cajas !== ''} // Deshabilitar si se especificaron cajas
              inputProps={{ 
                min: 0, 
                max: itemSeleccionado?.totalKilos || 0,
                step: 0.01
              }}
              helperText={
                formData.cajas 
                  ? `Calculado automáticamente: ${formData.kilos || 0} kg`
                  : `Máximo disponible: ${itemSeleccionado?.totalKilos || 0} kg`
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Unidades a Mover"
              type="number"
              value={formData.unidades || ''}
              onChange={(e) => handleInputChange('unidades', e.target.value)}
              disabled={loading || formData.cajas !== ''} // Deshabilitar si se especificaron cajas
              inputProps={{ 
                min: 0, 
                max: itemSeleccionado?.totalUnidades || 0
              }}
              helperText={
                formData.cajas 
                  ? `Calculado automáticamente: ${formData.unidades || 0} un`
                  : `Máximo disponible: ${itemSeleccionado?.totalUnidades || 0} un`
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Cancelar
        </Button>
                 <Button
           onClick={handleSubmit}
           disabled={loading}
           variant="contained"
           startIcon={loading ? <CircularProgress size={20} /> : <SwapIcon />}
         >
          {loading ? 'Procesando...' : 'Realizar Movimiento'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovimientoInterno;

