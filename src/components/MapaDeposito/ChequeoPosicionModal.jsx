import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useChequeoPosiciones } from '../../hooks/useChequeoPosiciones';

const ChequeoPosicionModal = ({ 
  open, 
  onClose, 
  posicion, 
  onChequeoActualizado 
}) => {
  const [nombre, setNombre] = useState('');
  const { actualizarChequeo, loading, error } = useChequeoPosiciones();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      return;
    }

    try {
      if (posicion && posicion.id) {
        await actualizarChequeo(posicion.id, nombre.trim());
        onChequeoActualizado();
        onClose();
        setNombre('');
      }
    } catch (err) {
      console.error('Error al actualizar chequeo:', err);
    }
  };

  const handleClose = () => {
    setNombre('');
    onClose();
  };

  const formatPositionString = (pos) => {
    if (!pos) return 'N/A';
    if (pos.entrada) return 'ENTRADA';
    if (pos.numeroPasillo) return `Pasillo ${pos.numeroPasillo}`;
    return `Rack ${pos.rack}-${pos.fila}-${pos.AB}`;
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
          Registrar Chequeo de Posición
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
            Posición: {formatPositionString(posicion)}
          </Typography>
          
          {posicion && posicion.ultimo_chequeo && (
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
              Último chequeo: {new Date(posicion.ultimo_chequeo).toLocaleString('es-ES')}
              {posicion.nombre && ` por ${posicion.nombre}`}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre de quien realiza el chequeo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
            sx={{ mb: 2 }}
            helperText="Ingrese su nombre para registrar el chequeo"
          />
        </form>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !nombre.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Registrando...' : 'Registrar Chequeo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChequeoPosicionModal;

