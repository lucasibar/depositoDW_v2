import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box,
  Typography,
  Alert,
  Chip
} from '@mui/material';
import { generatePosicionTitle } from '../../../features/stock/utils/posicionUtils';
import styles from './CorreccionForm.module.css';

export const CorreccionForm = ({ 
  open, 
  onClose, 
  item,
  posicion,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    kilos: '',
    unidades: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && item) {
      resetForm();
    }
  }, [open, item]);
  
  // Cerrar automáticamente si no hay datos válidos después de un tiempo
  useEffect(() => {
    if (open && (!item || !posicion)) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, item, posicion, onClose]);

  // Validar que tenemos los datos necesarios
  if (!open) {
    return null;
  }
  
  // Si no hay item o posicion, mostrar mensaje
  if (!item || !posicion) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography color="error">
              Error: No se pudo cargar la información necesaria para la corrección.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const resetForm = () => {
    setFormData({
      kilos: '', // Campo vacío para ingresar cantidad a eliminar
      unidades: '' // Campo vacío para ingresar cantidad a eliminar
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

  const validateForm = () => {
    const newErrors = {};
    
    const nuevosKilos = parseFloat(formData.kilos);
    const nuevasUnidades = parseInt(formData.unidades);
    
    if (!formData.kilos || nuevosKilos < 0) {
      newErrors.kilos = 'Debe ingresar kilos válidos (mínimo 0)';
    }
    
    if (!formData.unidades || nuevasUnidades < 0) {
      newErrors.unidades = 'Debe ingresar unidades válidas (mínimo 0)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Validar que no se elimine más de lo disponible
      const kilosAEliminar = parseFloat(formData.kilos);
      const unidadesAEliminar = parseInt(formData.unidades);
      
      if (kilosAEliminar > (item?.kilos || 0)) {
        setErrors({ kilos: `No puede eliminar más de ${item?.kilos || 0} kilos disponibles` });
        return;
      }
      
      if (unidadesAEliminar > (item?.unidades || 0)) {
        setErrors({ unidades: `No puede eliminar más de ${item?.unidades || 0} unidades disponibles` });
        return;
      }
      
      const submitData = {
        proveedor: item?.proveedor,
        tipoMovimiento: 'ajusteRESTA',
        item: {
          itemId: item?.itemId || item?.id,
          categoria: item?.categoria,
          descripcion: item?.descripcion,
          proveedor: item?.proveedor,
          partida: item?.partida,
          kilos: item?.kilos,
          unidades: item?.unidades
        },
        kilos: kilosAEliminar,
        unidades: unidadesAEliminar,
        partida: item?.partida,
        posicion: posicion?.posicionId || posicion?.id || ''
      };
      
      onSubmit(submitData);
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
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
        <Typography variant="h6">
          Eliminación Rápida - {item?.descripcion}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Información del item y posición */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Eliminando stock de:
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Posición:</strong> {posicion ? generatePosicionTitle(posicion) : 'Posición no disponible'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Material:</strong> {item?.categoria} - {item?.descripcion}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Partida:</strong> {item?.partida}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Chip 
                label={`Disponible: ${item?.unidades || 0} unidades`} 
                color="warning" 
                size="small" 
              />
              <Chip 
                label={`Disponible: ${(item?.kilos || 0).toFixed(2)} kg`} 
                color="warning" 
                size="small" 
              />
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Kilos a eliminar *"
            type="number"
            value={formData.kilos}
            onChange={(e) => handleInputChange('kilos', e.target.value)}
            error={!!errors.kilos}
            helperText={errors.kilos || `Ingrese los kilos a eliminar (máximo ${item?.kilos || 0})`}
            placeholder={`Ej: ${item?.kilos || 0}`}
            inputProps={{ 
              min: 0,
              max: item?.kilos || 0,
              step: 0.01
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Unidades a eliminar *"
            type="number"
            value={formData.unidades}
            onChange={(e) => handleInputChange('unidades', e.target.value)}
            error={!!errors.unidades}
            helperText={errors.unidades || `Ingrese las unidades a eliminar (máximo ${item?.unidades || 0})`}
            placeholder={`Ej: ${item?.unidades || 0}`}
            inputProps={{ 
              min: 0,
              max: item?.unidades || 0,
              step: 1
            }}
            sx={{ mb: 2 }}
          />

          {/* Botón para eliminar todo */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              onClick={() => {
                setFormData({
                  kilos: (item?.kilos || 0).toString(),
                  unidades: (item?.unidades || 0).toString()
                });
              }}
            >
              Eliminar todo el stock disponible
            </Button>
          </Box>


        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="error"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 