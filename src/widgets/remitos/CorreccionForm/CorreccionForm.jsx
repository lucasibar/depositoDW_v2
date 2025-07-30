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
      kilos: item?.kilos?.toString() || '',
      unidades: item?.unidades?.toString() || ''
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
      const submitData = {
        posicionId: posicion?.posicionId || posicion?.rack || posicion?.pasillo,
        itemId: item?.itemId || item?.categoria,
        partidaId: item?.partidaId || item?.partida,
        kilos: parseFloat(formData.kilos),
        unidades: parseInt(formData.unidades)
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
          Corrección de Stock
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Información del item y posición */}
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Corrigiendo stock en:
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
                label={`Actual: ${item?.unidades || 0} unidades`} 
                color="warning" 
                size="small" 
              />
              <Chip 
                label={`Actual: ${(item?.kilos || 0).toFixed(2)} kg`} 
                color="warning" 
                size="small" 
              />
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Nuevos Kilos *"
            type="number"
            value={formData.kilos}
            onChange={(e) => handleInputChange('kilos', e.target.value)}
            error={!!errors.kilos}
            helperText={errors.kilos || "Ingrese los nuevos kilos"}
            inputProps={{ 
              min: 0,
              step: 0.01
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Nuevas Unidades *"
            type="number"
            value={formData.unidades}
            onChange={(e) => handleInputChange('unidades', e.target.value)}
            error={!!errors.unidades}
            helperText={errors.unidades || "Ingrese las nuevas unidades"}
            inputProps={{ 
              min: 0,
              step: 1
            }}
            sx={{ mb: 2 }}
          />

          {/* Mostrar diferencia */}
          {formData.kilos && formData.unidades && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Resumen de cambios:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip 
                  label={`Kilos: ${item?.kilos || 0} → ${parseFloat(formData.kilos).toFixed(2)}`} 
                  color={parseFloat(formData.kilos) !== (item?.kilos || 0) ? "primary" : "default"}
                  size="small" 
                />
                <Chip 
                  label={`Unidades: ${item?.unidades || 0} → ${parseInt(formData.unidades)}`} 
                  color={parseInt(formData.unidades) !== (item?.unidades || 0) ? "primary" : "default"}
                  size="small" 
                />
              </Box>
            </Box>
          )}
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
          disabled={isSubmitting}
        >
          Aplicar Corrección
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 