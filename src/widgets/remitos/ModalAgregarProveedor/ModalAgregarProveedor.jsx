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
import { fetchRemitosData } from '../../../features/remitos/model/slice';
import { API_CONFIG } from '../../../config/api';
import styles from './ModalAgregarProveedor.module.css';

export const ModalAgregarProveedor = ({ open, onClose, onProveedorCreado }) => {
  const dispatch = useDispatch();
  const [nombreProveedor, setNombreProveedor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!nombreProveedor.trim()) {
      setError('Por favor ingrese un nombre de proveedor');
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
          nombre: nombreProveedor,
          categoria: "proveedor"
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el proveedor');
      }

      const nuevoProveedor = await response.json();
      
      // Recargar los datos de proveedores
      dispatch(fetchRemitosData());
      
      // Notificar al componente padre
      onProveedorCreado(nuevoProveedor);
      
      // Limpiar el formulario
      setNombreProveedor('');
      onClose();
    } catch (error) {
      setError('Error al crear el proveedor. Por favor intente nuevamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNombreProveedor('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
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
            label="Nombre del Proveedor"
            type="text"
            fullWidth
            value={nombreProveedor}
            onChange={(e) => setNombreProveedor(e.target.value)}
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
          disabled={loading || !nombreProveedor.trim()}
          variant="contained"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 