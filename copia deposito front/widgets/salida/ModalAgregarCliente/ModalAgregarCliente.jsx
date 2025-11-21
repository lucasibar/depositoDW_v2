import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { cargarDatosSalida } from '../../../features/salida/model/thunks';
import { API_CONFIG } from '../../../config/api';
import styles from './ModalAgregarCliente.module.css';

export const ModalAgregarCliente = ({ open, onClose, onClienteCreado }) => {
  const dispatch = useDispatch();
  const [nombreCliente, setNombreCliente] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!nombreCliente.trim()) {
      setError('Por favor ingrese un nombre de cliente');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/proveedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombreCliente,
          categoria: "clientes"
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }

      const nuevoCliente = await response.json();
      
      // Recargar los datos de salida (incluyendo clientes)
      dispatch(cargarDatosSalida());
      
      // Notificar al componente padre
      onClienteCreado(nuevoCliente);
      
      // Limpiar el formulario
      setNombreCliente('');
      onClose();
    } catch (error) {
      setError('Error al crear el cliente. Por favor intente nuevamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombreCliente('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Cliente"
            type="text"
            fullWidth
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          disabled={loading || !nombreCliente.trim()}
          variant="contained"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
