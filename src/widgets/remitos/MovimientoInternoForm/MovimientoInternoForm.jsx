import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Alert,
  Chip
} from '@mui/material';
import styles from './MovimientoInternoForm.module.css';

export const MovimientoInternoForm = ({ 
  open, 
  onClose, 
  item,
  posicionOrigen,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    rack: '',
    fila: '',
    nivel: '',
    pasillo: '',
    unidades: '',
    kilos: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && item) {
      resetForm();
    }
  }, [open, item]);
  
  // Cerrar automáticamente si no hay datos válidos después de un tiempo
  useEffect(() => {
    if (open && (!item || !posicionOrigen)) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, item, posicionOrigen, onClose]);

  // Validar que tenemos los datos necesarios
  if (!open) {
    return null;
  }
  
  // Si no hay item o posicionOrigen, mostrar mensaje
  if (!item || !posicionOrigen) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography color="error">
              Error: No se pudo cargar la información necesaria para el movimiento interno.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const resetForm = () => {
    setFormData({
      rack: '',
      fila: '',
      nivel: '',
      pasillo: '',
      unidades: item?.unidades || 0,
      kilos: item?.kilos || 0
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
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

  const isLocationSelected = () => {
    return ((formData.rack && formData.fila && formData.nivel) || formData.pasillo) && 
           formData.kilos > 0 && formData.unidades > 0;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar que se haya seleccionado una ubicación
    if (!formData.rack && !formData.pasillo) {
      newErrors.location = 'Debe seleccionar rack/fila/nivel o pasillo';
    }
    
    // Si se seleccionó rack, validar que estén todos los campos
    if (formData.rack && (!formData.fila || !formData.nivel)) {
      newErrors.location = 'Si selecciona rack, debe completar fila y nivel';
    }
    
    const unidadesSolicitadas = parseInt(formData.unidades);
    const kilosSolicitados = parseFloat(formData.kilos);
    
    if (!formData.unidades || unidadesSolicitadas <= 0) {
      newErrors.unidades = 'Debe ingresar unidades válidas';
    } else if (item && item.unidades && unidadesSolicitadas > item.unidades) {
      newErrors.unidades = `No puede mover más unidades de las disponibles (${item.unidades})`;
    }
    
    if (!formData.kilos || kilosSolicitados <= 0) {
      newErrors.kilos = 'Debe ingresar kilos válidos';
    } else if (item && item.kilos && kilosSolicitados > item.kilos) {
      newErrors.kilos = `No puede mover más kilos de los disponibles (${item.kilos.toFixed(2)})`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const selectedItem = {
        itemId: item?.itemId || item?.categoria,
        categoria: item?.categoria || '',
        descripcion: item?.descripcion || '',
        proveedor: item?.proveedor || null,
        partida: item?.partida || '',
        kilos: parseFloat(formData.kilos),
        unidades: parseInt(formData.unidades)
      };

      const data = formData.pasillo ? 
        { pasillo: parseInt(formData.pasillo) } : 
        { 
          rack: parseInt(formData.rack), 
          fila: parseInt(formData.fila), 
          nivel: formData.nivel 
        };
      
      const submitData = {
        selectedItem,
        data,
        id: posicionOrigen?.posicionId || posicionOrigen?.rack || posicionOrigen?.pasillo
      };
      
      onSubmit(submitData);
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCantidadMovimiento = (e) => {
    const value = parseInt(e.target.value);
    if (item && item.unidades && item.kilos) {
      const newKilos = Math.round((item.kilos / item.unidades) * value);
      const maxKilos = Math.min(newKilos, item.kilos);
      const maxUnidades = Math.min(value, item.unidades);

      setFormData(prev => ({
        ...prev,
        kilos: maxKilos,
        unidades: maxUnidades
      }));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">
          Movimiento Interno
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Información del item y posición origen */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Moviendo desde:
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Posición:</strong> {posicionOrigen?.rack ? 
                `Rack ${posicionOrigen.rack} Fila ${posicionOrigen.fila} Nivel ${posicionOrigen.AB}` : 
                `Pasillo ${posicionOrigen.pasillo}`}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Material:</strong> {item?.categoria || 'N/A'} - {item?.descripcion || 'N/A'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Partida:</strong> {item?.partida || 'N/A'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Chip 
                label={`Disponible: ${item?.unidades || 0} unidades`} 
                color="info" 
                size="small" 
              />
              <Chip 
                label={`Disponible: ${(item?.kilos || 0).toFixed(2)} kg`} 
                color="info" 
                size="small" 
              />
            </Box>
          </Box>

          {/* Campos de ubicación destino */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <TextField
              label="Rack"
              value={formData.rack}
              onChange={(e) => handleInputChange('rack', e.target.value)}
              disabled={formData.pasillo !== ''}
              select
              sx={{ width: '100px' }}
            >
              {[...Array(20)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Fila"
              value={formData.fila}
              onChange={(e) => handleInputChange('fila', e.target.value)}
              disabled={formData.pasillo !== ''}
              select
              sx={{ width: '100px' }}
            >
              {[...Array(14)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nivel"
              value={formData.nivel}
              onChange={(e) => handleInputChange('nivel', e.target.value)}
              disabled={formData.pasillo !== ''}
              select
              sx={{ width: '100px' }}
            >
              {['A', 'B'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Pasillo"
              value={formData.pasillo}
              onChange={(e) => {
                handleInputChange('pasillo', e.target.value);
                handleInputChange('rack', '');
                handleInputChange('fila', '');
                handleInputChange('nivel', '');
              }}
              select
              sx={{ width: '100px' }}
            >
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i} value={i}>{i}</MenuItem>
              ))}
            </TextField>
          </Box>

          {errors.location && (
            <Alert severity="error" sx={{ mb: 2 }}>{errors.location}</Alert>
          )}

          <Typography variant="h6" component="h6" sx={{ mt: 2 }}>
            Kilos {formData.kilos}
          </Typography>
          
          <TextField
            fullWidth
            label="Unidades a Mover *"
            type="number"
            value={formData.unidades}
            onChange={handleCantidadMovimiento}
            error={!!errors.unidades}
            helperText={errors.unidades || `Máximo disponible: ${item?.unidades || 0} unidades`}
            inputProps={{ 
              min: 1, 
              max: item?.unidades || 1,
              step: 1
            }}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={!isLocationSelected()}
        >
          Realizar Movimiento
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 