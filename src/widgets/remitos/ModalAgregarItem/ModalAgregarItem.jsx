import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchRemitosData } from '../../../features/remitos/model/slice';
import { API_CONFIG } from '../../../config/api';
import styles from './ModalAgregarItem.module.css';

// Categorías disponibles
const CATEGORIAS = [
  "costura", "algodon", "algodon-color", "nylon", "nylon REC", "nylon-color", "lycra", "lycra REC", 
  "goma", "tarugo", "etiqueta", "bolsa", "percha", "ribbon", "caja", 
  "cinta", "plantilla", "film", "consumibes(aceite y parafina)", "faja", "caballete"
];

export const ModalAgregarItem = ({ open, onClose, onItemCreado, proveedorSeleccionado }) => {
  const dispatch = useDispatch();
  const [nuevoItem, setNuevoItem] = useState({
    descripcion: '',
    categoria: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!nuevoItem.descripcion.trim() || !nuevoItem.categoria) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (!proveedorSeleccionado) {
      setError('Debe seleccionar un proveedor primero');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: nuevoItem.descripcion,
          categoria: nuevoItem.categoria,
          proveedor: proveedorSeleccionado
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el item');
      }

      const itemCreado = await response.json();
      
      // Recargar los datos de items y proveedores
      dispatch(fetchRemitosData());
      
      // Notificar al componente padre
      onItemCreado(itemCreado);
      
      // Limpiar el formulario
      setNuevoItem({ descripcion: '', categoria: '' });
      onClose();
    } catch (error) {
      setError('Error al crear el item. Por favor intente nuevamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNuevoItem({ descripcion: '', categoria: '' });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar Nuevo Item</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={nuevoItem.categoria}
              label="Categoría"
              onChange={(e) => setNuevoItem({...nuevoItem, categoria: e.target.value})}
              disabled={loading}
            >
              {CATEGORIAS.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            autoFocus
            margin="dense"
            label="Descripción del Item"
            type="text"
            fullWidth
            value={nuevoItem.descripcion}
            onChange={(e) => setNuevoItem({...nuevoItem, descripcion: e.target.value})}
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
          disabled={loading || !nuevoItem.descripcion.trim() || !nuevoItem.categoria}
          variant="contained"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 