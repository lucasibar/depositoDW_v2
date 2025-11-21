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
  IconButton
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

  // Calcular kilos correspondientes basado en unidades
  const calcularKilosCorrespondientes = (unidades) => {
    if (!unidades || !item?.kilos || !item?.unidades) return 0;
    
    const unidadesNum = parseInt(unidades);
    if (unidadesNum <= 0) return 0;
    
    // Fórmula: (total kilos / total unidades) * unidades a eliminar
    const kilosPorUnidad = item.kilos / item.unidades;
    const kilosCorrespondientes = Math.round(kilosPorUnidad * unidadesNum);
    
    return kilosCorrespondientes;
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nuevasUnidades = parseInt(formData.unidades);
    
    if (!formData.unidades || nuevasUnidades <= 0) {
      newErrors.unidades = 'Debe ingresar unidades válidas (mínimo 1)';
    }
    
    if (nuevasUnidades > (item?.unidades || 0)) {
      newErrors.unidades = `No puede eliminar más de ${item?.unidades || 0} unidades disponibles`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const unidadesAEliminar = parseInt(formData.unidades);
      const kilosAEliminar = calcularKilosCorrespondientes(unidadesAEliminar);
      
      // Crear los datos en el formato que espera el backend
      const submitData = {
        proveedor: item?.proveedor,
        tipoMovimiento: 'ajusteRESTA',
        item: {
          itemId: item?.itemId || item?.id || '',
          categoria: item?.categoria || '',
          descripcion: item?.descripcion || '',
          proveedor: item?.proveedor,
          partida: item?.partida || '',
          kilos: kilosAEliminar, // Usar los kilos a eliminar, no los totales
          unidades: unidadesAEliminar // Usar las unidades a eliminar, no las totales
        },
        kilos: kilosAEliminar,
        unidades: unidadesAEliminar,
        partida: item?.partida || '',
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

  const handleEliminarTodo = () => {
    setFormData({
      unidades: (item?.unidades || 0).toString()
    });
  };

  // Calcular kilos correspondientes para mostrar en tiempo real
  const kilosCalculados = calcularKilosCorrespondientes(formData.unidades);

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
            subtitle="Especifique cuántas unidades eliminar"
            padding="compact"
            sx={{ mb: 0 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Unidades */}
              <Box>
                <TextField
                  fullWidth
                  label="Unidades a eliminar"
                  type="number"
                  value={formData.unidades}
                  onChange={(e) => handleInputChange('unidades', e.target.value)}
                  error={!!errors.unidades}
                  helperText={errors.unidades || `Máximo: ${item?.unidades || 0} unidades`}
                  inputProps={{ 
                    min: 1,
                    max: item?.unidades || 0,
                    step: 1
                  }}
                  size="medium"
                />
                
                {/* Mostrar kilos calculados */}
                {formData.unidades && !errors.unidades && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--color-warning)' }}>
                      Kilos correspondientes a eliminar: <strong>{kilosCalculados} kg</strong>
                    </Typography>
                  </Box>
                )}
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
          disabled={isSubmitting || !formData.unidades}
          startIcon={<EditIcon />}
        >
          {isSubmitting ? 'Eliminando...' : 'Eliminar Stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 