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
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { 
  SwapHoriz as SwapIcon,
  LocationOn as LocationIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ModernCard from '../../../shared/ui/ModernCard/ModernCard';

export const MovimientoInternoForm = ({ 
  open, 
  onClose, 
  item,
  posicionOrigen,
  onSubmit 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    rack: '',
    fila: '',
    nivel: '',
    pasillo: '',
    unidades: '',
    kilos: ''
  });
  
  const [errors, setErrors] = useState({});
  const [locationType, setLocationType] = useState('rack'); // 'rack' o 'pasillo'

  useEffect(() => {
    if (open && item) {
      resetForm();
    }
  }, [open, item]);
  
  useEffect(() => {
    if (open && (!item || !posicionOrigen)) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, item, posicionOrigen, onClose]);

  if (!open) return null;
  
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
    setLocationType('rack');
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

  const handleLocationTypeChange = (type) => {
    setLocationType(type);
    if (type === 'rack') {
      setFormData(prev => ({ ...prev, pasillo: '' }));
    } else {
      setFormData(prev => ({ ...prev, rack: '', fila: '', nivel: '' }));
    }
  };

  const isLocationSelected = () => {
    if (locationType === 'rack') {
      return formData.rack && formData.fila && formData.nivel;
    } else {
      return formData.pasillo;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isLocationSelected()) {
      newErrors.location = 'Debe seleccionar una ubicación de destino';
    }
    
    const unidadesSolicitadas = parseInt(formData.unidades);
    const kilosSolicitados = parseFloat(formData.kilos);
    
    if (!formData.unidades || unidadesSolicitadas <= 0) {
      newErrors.unidades = 'Debe ingresar unidades válidas';
    } else if (item && item.unidades && unidadesSolicitadas > item.unidades) {
      newErrors.unidades = `Máximo disponible: ${item.unidades} unidades`;
    }
    
    if (!formData.kilos || kilosSolicitados <= 0) {
      newErrors.kilos = 'Debe ingresar kilos válidos';
    } else if (item && item.kilos && kilosSolicitados > item.kilos) {
      newErrors.kilos = `Máximo disponible: ${item.kilos.toFixed(2)} kg`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const selectedItem = {
        itemId: item?.itemId || item?.id || '',
        categoria: item?.categoria || '',
        descripcion: item?.descripcion || '',
        proveedor: item?.proveedor || null,
        partida: item?.partida || '',
        kilos: parseFloat(formData.kilos),
        unidades: parseInt(formData.unidades)
      };

      const data = locationType === 'pasillo' ? 
        { pasillo: parseInt(formData.pasillo) } : 
        { 
          rack: parseInt(formData.rack), 
          fila: parseInt(formData.fila), 
          nivel: formData.nivel 
        };
      
      const submitData = {
        selectedItem,
        data,
        id: posicionOrigen?.posicionId || posicionOrigen?.id || ''
      };
      
  
      onSubmit(submitData);
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (item && item.unidades && item.kilos) {
      const newKilos = Math.round((item.kilos / item.unidades) * value * 100) / 100;
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
          <SwapIcon sx={{ color: 'var(--color-secondary)', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Mover Stock
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
            title="Material a Mover"
            subtitle="Información del stock disponible"
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

          {/* Ubicación de destino */}
          <ModernCard
            title="Destino"
            subtitle="Seleccione la nueva ubicación"
            padding="compact"
            sx={{ mb: 0 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              {/* Selector de tipo de ubicación */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={locationType === 'rack' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleLocationTypeChange('rack')}
                  sx={{ 
                    flex: 1,
                    backgroundColor: locationType === 'rack' ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  Rack/Fila/Nivel
                </Button>
                <Button
                  variant={locationType === 'pasillo' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleLocationTypeChange('pasillo')}
                  sx={{ 
                    flex: 1,
                    backgroundColor: locationType === 'pasillo' ? 'var(--color-primary)' : 'transparent'
                  }}
                >
                  Pasillo
                </Button>
              </Box>

              {/* Campos de ubicación */}
              {locationType === 'rack' ? (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
                    <InputLabel>Rack</InputLabel>
                    <Select
                      value={formData.rack}
                      onChange={(e) => handleInputChange('rack', e.target.value)}
                      label="Rack"
                    >
                      {[...Array(20)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>R{i + 1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
                    <InputLabel>Fila</InputLabel>
                    <Select
                      value={formData.fila}
                      onChange={(e) => handleInputChange('fila', e.target.value)}
                      label="Fila"
                    >
                      {[...Array(14)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>F{i + 1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
                    <InputLabel>Nivel</InputLabel>
                    <Select
                      value={formData.nivel}
                      onChange={(e) => handleInputChange('nivel', e.target.value)}
                      label="Nivel"
                    >
                      {['A', 'B'].map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ) : (
                <FormControl size="small" fullWidth>
                  <InputLabel>Pasillo</InputLabel>
                  <Select
                    value={formData.pasillo}
                    onChange={(e) => handleInputChange('pasillo', e.target.value)}
                    label="Pasillo"
                  >
                    {[...Array(12)].map((_, i) => (
                      <MenuItem key={i} value={i}>Pasillo {i}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {errors.location && (
                <Alert severity="error" sx={{ mt: 1 }}>{errors.location}</Alert>
              )}
            </Box>
          </ModernCard>

          {/* Cantidad a mover */}
          <ModernCard
            title="Cantidad"
            subtitle="Especifique cuánto stock mover"
            padding="compact"
            sx={{ mb: 0 }}
          >
            <TextField
              fullWidth
              label="Unidades a mover"
              type="number"
              value={formData.unidades}
              onChange={handleCantidadChange}
              error={!!errors.unidades}
              helperText={errors.unidades || `Máximo: ${item?.unidades || 0} unidades`}
              inputProps={{ 
                min: 1, 
                max: item?.unidades || 1,
                step: 1
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Kilos a mover"
              type="number"
              value={formData.kilos}
              onChange={(e) => handleInputChange('kilos', e.target.value)}
              error={!!errors.kilos}
              helperText={errors.kilos || `Máximo: ${(item?.kilos || 0).toFixed(2)} kg`}
              inputProps={{ 
                min: 0.01,
                max: item?.kilos || 0,
                step: 0.01
              }}
            />
          </ModernCard>
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
            backgroundColor: 'var(--color-secondary)',
            '&:hover': {
              backgroundColor: 'var(--color-secondary-dark)'
            }
          }}
          disabled={!isLocationSelected()}
          startIcon={<SwapIcon />}
        >
          Mover Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 