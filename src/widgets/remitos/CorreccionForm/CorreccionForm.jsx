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
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Slider
} from '@mui/material';
import { 
  Edit as EditIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { generatePosicionTitle } from '../../../features/stock/utils/posicionUtils';
import ModernCard from '../../../shared/ui/ModernCard/ModernCard';

export const CorreccionForm = ({ 
  open, 
  onClose, 
  item,
  posicion,
  onSubmit 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
  
  useEffect(() => {
    if (open && (!item || !posicion)) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, item, posicion, onClose]);

  if (!open) return null;
  
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
      kilos: '',
      unidades: ''
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSliderChange = (field, value) => {
    const maxValue = field === 'kilos' ? item?.kilos || 0 : item?.unidades || 0;
    const percentage = value / 100;
    const newValue = Math.round(maxValue * percentage * 100) / 100;
    
    setFormData(prev => ({
      ...prev,
      [field]: newValue.toString()
    }));
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
        posicionId: posicion?.posicionId || posicion?.id || '',
        itemId: item?.itemId || item?.id || '',
        kilos: kilosAEliminar,
        unidades: unidadesAEliminar
      };
      

      
      onSubmit(submitData);
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEliminarTodo = () => {
    setFormData({
      kilos: (item?.kilos || 0).toString(),
      unidades: (item?.unidades || 0).toString()
    });
  };

  const kilosPercentage = formData.kilos ? (parseFloat(formData.kilos) / (item?.kilos || 1)) * 100 : 0;
  const unidadesPercentage = formData.unidades ? (parseInt(formData.unidades) / (item?.unidades || 1)) * 100 : 0;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 'var(--border-radius-lg)',
          boxShadow: 'var(--shadow-lg)'
        }
      }}
    >
      {/* Header con icono y título */}
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon sx={{ color: 'var(--color-warning)', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Ajustar Stock
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Información del item */}
          <ModernCard
            title="Material a Ajustar"
            subtitle="Información del stock actual"
            padding="compact"
            sx={{ mb: 0 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcon sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item?.categoria} - {item?.descripcion}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label={`${item?.unidades || 0} unidades`} 
                  color="primary" 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label={`${(item?.kilos || 0).toFixed(2)} kg`} 
                  color="secondary" 
                  size="small" 
                  variant="outlined"
                />
                {item?.partida && (
                  <Chip 
                    label={`P: ${item.partida}`} 
                    color="default" 
                    size="small" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </ModernCard>

          {/* Cantidad a eliminar */}
          <ModernCard
            title="Cantidad a Eliminar"
            subtitle="Especifique cuánto stock eliminar"
            padding="compact"
            sx={{ mb: 0 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Kilos */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Kilos a eliminar: {formData.kilos || 0} kg
                </Typography>
                <Slider
                  value={kilosPercentage}
                  onChange={(_, value) => handleSliderChange('kilos', value)}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round((item?.kilos || 0) * value / 100)} kg`}
                  sx={{
                    color: 'var(--color-warning)',
                    '& .MuiSlider-thumb': {
                      backgroundColor: 'var(--color-warning)'
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Kilos específicos"
                  type="number"
                  value={formData.kilos}
                  onChange={(e) => handleInputChange('kilos', e.target.value)}
                  error={!!errors.kilos}
                  helperText={errors.kilos || `Máximo: ${item?.kilos || 0} kg`}
                  inputProps={{ 
                    min: 0,
                    max: item?.kilos || 0,
                    step: 0.01
                  }}
                  size="small"
                />
              </Box>

              {/* Unidades */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Unidades a eliminar: {formData.unidades || 0} uds
                </Typography>
                <Slider
                  value={unidadesPercentage}
                  onChange={(_, value) => handleSliderChange('unidades', value)}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round((item?.unidades || 0) * value / 100)} uds`}
                  sx={{
                    color: 'var(--color-warning)',
                    '& .MuiSlider-thumb': {
                      backgroundColor: 'var(--color-warning)'
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Unidades específicas"
                  type="number"
                  value={formData.unidades}
                  onChange={(e) => handleInputChange('unidades', e.target.value)}
                  error={!!errors.unidades}
                  helperText={errors.unidades || `Máximo: ${item?.unidades || 0} unidades`}
                  inputProps={{ 
                    min: 0,
                    max: item?.unidades || 0,
                    step: 1
                  }}
                  size="small"
                />
              </Box>

              {/* Botón para eliminar todo */}
              <Button
                variant="outlined"
                color="warning"
                fullWidth
                onClick={handleEliminarTodo}
                startIcon={<WarningIcon />}
                sx={{ 
                  borderColor: 'var(--color-warning)',
                  color: 'var(--color-warning)',
                  '&:hover': {
                    backgroundColor: 'var(--color-warning)',
                    color: 'white'
                  }
                }}
              >
                Eliminar todo el stock disponible
              </Button>
            </Box>
          </ModernCard>

          {/* Advertencia */}
          <Alert 
            severity="warning" 
            icon={<WarningIcon />}
            sx={{ 
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid var(--color-warning)'
            }}
          >
            <Typography variant="body2">
              <strong>Advertencia:</strong> Esta acción eliminará permanentemente el stock seleccionado. 
              Esta operación no se puede deshacer.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ color: 'var(--color-text-secondary)' }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ 
            backgroundColor: 'var(--color-warning)',
            '&:hover': {
              backgroundColor: 'var(--color-warning-dark)'
            }
          }}
          disabled={isSubmitting || (!formData.kilos && !formData.unidades)}
          startIcon={<EditIcon />}
        >
          {isSubmitting ? 'Eliminando...' : 'Eliminar Stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 