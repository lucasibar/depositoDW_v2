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
import { apiClient } from '../../../config/api';

const AjustePosicionModal = ({ open, onClose, material, onAjusteExitoso }) => {
  const [formData, setFormData] = useState({
    cajas: '',
    kilos: '',
    unidades: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    // Solo permitir números positivos
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field === 'cajas') {
        // Si se cambia el número de cajas, calcular automáticamente los kilos
        newData.cajas = numericValue;
        const kilosCalculados = calcularKilosPorCajas(
          numericValue, 
          material?.totalKilos, 
          material?.totalUnidades
        );
        newData.kilos = kilosCalculados;
        newData.unidades = numericValue; // Las unidades son iguales a las cajas
      } else {
        newData[field] = numericValue;
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    console.log('🔄 Iniciando proceso de ajuste desde posiciones...');
    console.log('📋 Datos del formulario:', formData);
    console.log('📦 Material seleccionado:', material);
    
    // Validar que se haya especificado cajas o kilos/unidades
    if (!formData.cajas && (!formData.kilos && !formData.unidades)) {
      setError('Debes especificar la cantidad de cajas o los kilos y unidades a ajustar');
      return;
    }

    // Si se especificaron cajas, validar que sean válidas
    if (formData.cajas) {
      const cajasNum = parseInt(formData.cajas);
      if (cajasNum <= 0) {
        setError('La cantidad de cajas debe ser mayor a 0');
        return;
      }
      if (cajasNum > material.totalUnidades) {
        setError(`No puedes ajustar más cajas de las disponibles (${material.totalUnidades} cajas)`);
        return;
      }
    }

    const kilos = parseFloat(formData.kilos) || 0;
    const unidades = parseInt(formData.unidades) || 0;

    console.log(`📊 Cantidades a restar: ${kilos} kilos, ${unidades} unidades`);

    if (kilos > material.totalKilos) {
      setError(`No puedes restar más kilos de los disponibles (${material.totalKilos} kg)`);
      return;
    }

    if (unidades > material.totalUnidades) {
      setError(`No puedes restar más unidades de las disponibles (${material.totalUnidades} un)`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ajusteData = {
        proveedor: material.proveedor,
        tipoMovimiento: 'ajusteRESTA',
        item: {
          itemId: material.item.id,
          categoria: material.item.categoria,
          descripcion: material.item.descripcion,
          proveedor: material.proveedor,
          partida: material.partida.numeroPartida,
          kilos: kilos,
          unidades: unidades
        },
        kilos: kilos,
        unidades: unidades,
        partida: material.partida.numeroPartida,
        posicion: material.posicion.id
      };

      console.log('📤 Enviando datos de ajuste al backend:', ajusteData);

      // Llamar al endpoint de ajuste de stock
      await apiClient.post('/movimientos/ajuste-stock', ajusteData);
      
      console.log('✅ Ajuste realizado exitosamente');
      onAjusteExitoso();
      handleClose();
    } catch (error) {
      console.error('❌ Error al ajustar material:', error);
      setError(error.response?.data?.message || error.message || 'Error al realizar el ajuste');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ cajas: '', kilos: '', unidades: '' });
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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Ajustar Stock - Posición
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {/* Información del material */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Material a ajustar:
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Item:</strong> {material?.item?.categoria} - {material?.item?.descripcion}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Partida:</strong> {material?.partida?.numeroPartida}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Proveedor:</strong> {material?.proveedor?.nombre}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Stock actual:</strong> {material?.totalKilos || 0} kg, {material?.totalUnidades || 0} un
            </Typography>
          </Box>

          {/* Información sobre cálculo automático */}
          {material?.totalKilos && material?.totalUnidades && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Cálculo automático:</strong> Si especificas la cantidad de cajas, 
                los kilos se calcularán automáticamente. 
                Kilos por caja: {(material.totalKilos / material.totalUnidades).toFixed(2)} kg
              </Typography>
            </Alert>
          )}

          {/* Campos de entrada */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Cantidad de Cajas"
              type="text"
              value={formData.cajas}
              onChange={(e) => handleInputChange('cajas', e.target.value)}
              fullWidth
              disabled={loading}
              helperText={`Máximo disponible: ${material?.totalUnidades || 0} cajas`}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Kilos a restar"
              type="text"
              value={formData.kilos}
              onChange={(e) => handleInputChange('kilos', e.target.value)}
              fullWidth
              disabled={loading || formData.cajas !== ''} // Deshabilitar si se especificaron cajas
              helperText={
                formData.cajas 
                  ? `Calculado automáticamente: ${formData.kilos || 0} kg`
                  : "Ingresa la cantidad de kilos a restar"
              }
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Unidades a restar"
              type="text"
              value={formData.unidades}
              onChange={(e) => handleInputChange('unidades', e.target.value)}
              fullWidth
              disabled={loading || formData.cajas !== ''} // Deshabilitar si se especificaron cajas
              helperText={
                formData.cajas 
                  ? `Calculado automáticamente: ${formData.unidades || 0} un`
                  : "Ingresa la cantidad de unidades a restar"
              }
            />
          </Box>
        </Box>
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
          disabled={loading || (!formData.cajas && !formData.kilos && !formData.unidades)}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Ajustando...' : 'Realizar Ajuste'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AjustePosicionModal;
