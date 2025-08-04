import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { dataProveedoresItems } from '../../../remitos/model/slice';

const SalidaForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading = false,
  selectedItem = null 
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    cliente: '',
    fecha: new Date().toISOString().split('T')[0],
    kilos: '',
    unidades: '',
    partida: ''
  });
  const [errors, setErrors] = useState({});

  // Redux selectors
  const { proveedores, isLoading: loadingProveedores } = useSelector(state => state.remitos);

  // Cargar proveedores al abrir el formulario
  useEffect(() => {
    if (open && (!proveedores || proveedores.length === 0)) {
      dispatch(dataProveedoresItems());
    }
  }, [open, dispatch, proveedores]);

  // Pre-cargar datos del item seleccionado
  useEffect(() => {
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        kilos: selectedItem.kilos || '',
        unidades: selectedItem.unidades || '',
        partida: selectedItem.partida || ''
      }));
    }
  }, [selectedItem]);

  // Filtrar proveedores que tengan "cliente" en su categoría
  const clientes = proveedores?.filter(prov => 
    prov.categoria?.toLowerCase().includes('cliente')
  ) || [];

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cliente.trim()) {
      newErrors.cliente = 'El cliente es requerido';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!formData.kilos && !formData.unidades) {
      newErrors.kilos = 'Debe especificar kilos o unidades';
    }

    if (formData.kilos && parseFloat(formData.kilos) <= 0) {
      newErrors.kilos = 'Los kilos deben ser mayores a 0';
    }

    if (formData.unidades && parseInt(formData.unidades) <= 0) {
      newErrors.unidades = 'Las unidades deben ser mayores a 0';
    }

    // Remover validación de partida ya que se carga automáticamente
    // if (!formData.partida.trim()) {
    //   newErrors.partida = 'La partida es requerida';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      cliente: '',
      fecha: new Date().toISOString().split('T')[0],
      kilos: '',
      unidades: '',
      partida: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Agregar al Remito de Salida
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Cliente */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cliente"
                value={formData.cliente}
                onChange={handleChange('cliente')}
                error={!!errors.cliente}
                helperText={errors.cliente}
                disabled={loadingProveedores}
              >
                {loadingProveedores ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Cargando clientes...
                  </MenuItem>
                ) : clientes.length === 0 ? (
                  <MenuItem disabled>
                    No hay clientes disponibles
                  </MenuItem>
                ) : (
                  clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {/* Fecha */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Salida"
                value={formData.fecha}
                onChange={handleChange('fecha')}
                error={!!errors.fecha}
                helperText={errors.fecha}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Kilos */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Kilos"
                value={formData.kilos}
                onChange={handleChange('kilos')}
                error={!!errors.kilos}
                helperText={errors.kilos}
                placeholder="0.00"
                inputProps={{ step: "0.01", min: "0" }}
              />
            </Grid>

            {/* Unidades */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Unidades"
                value={formData.unidades}
                onChange={handleChange('unidades')}
                error={!!errors.unidades}
                helperText={errors.unidades}
                placeholder="0"
                inputProps={{ min: "0" }}
              />
            </Grid>

            {/* Información del item seleccionado */}
            {selectedItem && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Material seleccionado:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedItem.categoria} - {selectedItem.descripcion}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stock disponible: {selectedItem.kilos?.toFixed(2)} kg / {selectedItem.unidades} unidades
                  </Typography>
                  {selectedItem.proveedor?.nombre && (
                    <Typography variant="body2" color="textSecondary">
                      Proveedor: {selectedItem.proveedor.nombre}
                    </Typography>
                  )}
                  {selectedItem.partida && (
                    <Typography variant="body2" color="textSecondary">
                      Partida: {selectedItem.partida}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading || loadingProveedores}
          >
            {loading ? <CircularProgress size={20} /> : 'Agregar al Remito'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SalidaForm; 