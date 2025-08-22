import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { stockApi } from '../api/stockApi';

const AjusteMaterialModal = ({ open, onClose, material, onAjusteExitoso }) => {
  const [formData, setFormData] = useState({
    kilos: '',
    unidades: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    // Solo permitir números positivos
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSubmit = async () => {
    console.log('🔄 Iniciando proceso de ajuste...');
    console.log('📋 Datos del formulario:', formData);
    console.log('📦 Material seleccionado:', material);
    
    if (!formData.kilos && !formData.unidades) {
      setError('Debes ingresar al menos kilos o unidades');
      return;
    }

    const kilos = parseFloat(formData.kilos) || 0;
    const unidades = parseInt(formData.unidades) || 0;

    console.log(`📊 Cantidades a restar: ${kilos} kilos, ${unidades} unidades`);

    if (kilos > material.kilos) {
      setError(`No puedes restar más kilos de los disponibles (${material.kilos} kg)`);
      return;
    }

    if (unidades > material.unidades) {
      setError(`No puedes restar más unidades de las disponibles (${material.unidades} un)`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ajusteData = {
        itemId: material.item.id,
        partidaId: material.partidaId, // Usar el ID de la partida
        posicionId: material.posicion.id,
        proveedorId: material.proveedor.id,
        kilos: kilos,
        unidades: unidades
      };

      console.log('📤 Enviando datos de ajuste al backend:', ajusteData);

      await stockApi.ajustarMaterial(ajusteData);
      
      console.log('✅ Ajuste realizado exitosamente');
      onAjusteExitoso();
      handleClose();
    } catch (error) {
      console.error('❌ Error al ajustar material:', error);
      setError(error.message || 'Error al realizar el ajuste');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ kilos: '', unidades: '' });
    setError('');
    setLoading(false);
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
        Ajustar Stock - {material?.item?.descripcion}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Posición: {material?.posicion?.rack && material?.posicion?.fila && material?.posicion?.AB 
              ? `${material.posicion.rack}-${material.posicion.fila}-${material.posicion.AB}`
              : `Pasillo ${material?.posicion?.numeroPasillo}`
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Partida: {material?.partida}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Stock disponible: {material?.kilos} kg, {material?.unidades} un
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <TextField
            label="Kilos a restar"
            type="number"
            value={formData.kilos}
            onChange={(e) => handleInputChange('kilos', e.target.value)}
            fullWidth
            inputProps={{ 
              min: 0, 
              max: material?.kilos || 0,
              step: 0.01
            }}
            helperText={`Máximo: ${material?.kilos || 0} kg`}
          />
          
          <TextField
            label="Unidades a restar"
            type="number"
            value={formData.unidades}
            onChange={(e) => handleInputChange('unidades', e.target.value)}
            fullWidth
            inputProps={{ 
              min: 0, 
              max: material?.unidades || 0
            }}
            helperText={`Máximo: ${material?.unidades || 0} un`}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading || (!formData.kilos && !formData.unidades)}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Ajustando...' : 'Ajustar Stock'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AjusteMaterialModal;
