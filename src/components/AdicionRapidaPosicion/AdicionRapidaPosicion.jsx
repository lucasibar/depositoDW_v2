import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Autocomplete
} from '@mui/material';
import { dataProveedoresItems } from '../../features/remitos/model/slice';
import { ModalAgregarItem } from '../../widgets/remitos/ModalAgregarItem';
import axios from 'axios';

const URL = "https://derwill-deposito-backend.onrender.com";

// Modal para crear nuevo proveedor
const ModalNuevoProveedor = ({ open, onClose, onProveedorCreado }) => {
  const [nombreProveedor, setNombreProveedor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombreProveedor.trim()) {
      alert('Por favor ingrese un nombre de proveedor');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${URL}/proveedores`, {
        nombre: nombreProveedor,
        categoria: "proveedor"
      });
      
      onProveedorCreado(response.data);
      setNombreProveedor('');
      onClose();
    } catch (error) {
      alert('Error al crear el proveedor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nombre del Proveedor"
          type="text"
          fullWidth
          value={nombreProveedor}
          onChange={(e) => setNombreProveedor(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary"
          disabled={loading}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AdicionRapidaPosicion = ({ open, onClose, posicion, onSubmit }) => {
  const dispatch = useDispatch();
  const proveedores = useSelector((state) => state.remitos.proveedores);
  const allItems = useSelector((state) => state.remitos.items || []);
  
  const [formData, setFormData] = useState({
    proveedor: '',
    item: '',
    kilos: '',
    unidades: '',
    partida: '',
    tipoMovimiento: 'ajusteSUMA'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para los modales
  const [openNuevoProveedor, setOpenNuevoProveedor] = useState(false);
  const [openNuevoItem, setOpenNuevoItem] = useState(false);

  // Filtrar items por proveedor seleccionado
  const itemsProveedor = formData.proveedor 
    ? allItems.filter(item => item.proveedor?.id === formData.proveedor.id)
    : [];

  // Cargar proveedores cuando se abra el modal
  useEffect(() => {
    if (open && (!proveedores || proveedores.length === 0)) {
      dispatch(dataProveedoresItems());
    }
  }, [open, dispatch, proveedores]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProveedorCreado = (nuevoProveedor) => {
    dispatch(dataProveedoresItems());
    setFormData(prev => ({
      ...prev,
      proveedor: nuevoProveedor
    }));
  };

  const handleItemCreado = (nuevoItem) => {
    dispatch(dataProveedoresItems());
    setFormData(prev => ({
      ...prev,
      item: nuevoItem
    }));
  };

  const handleSubmit = async () => {
    // Validación básica
    if (!formData.proveedor || !formData.item || !formData.partida || 
        !formData.kilos || !formData.unidades) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (!posicion) {
      setError('No se ha seleccionado una posición');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const adicionData = {
        proveedor: formData.proveedor,
        tipoMovimiento: formData.tipoMovimiento,
        item: {
          itemId: formData.item.id,
          categoria: formData.item.categoria,
          descripcion: formData.item.descripcion,
          proveedor: formData.item.proveedor,
          partida: formData.partida,
          kilos: 0,
          unidades: 0
        },
        kilos: parseInt(formData.kilos),
        unidades: parseInt(formData.unidades),
        partida: formData.partida,
        posicion: posicion.id || posicion.posicionId || ''
      };

      onSubmit(adicionData);
      onClose();
      setFormData({
        proveedor: '',
        item: '',
        kilos: '',
        unidades: '',
        partida: '',
        tipoMovimiento: 'ajusteSUMA'
      });
    } catch (error) {
      setError('Error al agregar el item. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({
        proveedor: '',
        item: '',
        kilos: '',
        unidades: '',
        partida: '',
        tipoMovimiento: 'ajusteSUMA'
      });
      setError('');
    }
  };

  // Generar título de la posición
  const getTituloPosicion = () => {
    if (!posicion) return 'Adición Rápida';
    
    if (posicion.pasillo) {
      return `Adición Rápida - Pasillo ${posicion.pasillo}`;
    } else if (posicion.rack && posicion.fila && posicion.AB) {
      return `Adición Rápida - Rack ${posicion.rack} - Fila ${posicion.fila} - Nivel ${posicion.AB}`;
    } else if (posicion.entrada) {
      return 'Adición Rápida - Posición de Entrada';
    }
    
    return 'Adición Rápida';
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {getTituloPosicion()}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Autocomplete
                options={proveedores || []}
                getOptionLabel={(option) => option ? option.nombre || '' : ''}
                value={formData.proveedor}
                onChange={(event, newValue) => handleInputChange('proveedor', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Proveedor"
                    required
                    placeholder="Buscar proveedor..."
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    {option.nombre}
                  </Box>
                )}
                noOptionsText="No se encontraron proveedores"
                loading={!proveedores || proveedores.length === 0}
                loadingText="Cargando proveedores..."
                filterOptions={(options, { inputValue }) => {
                  const filtered = options.filter(option =>
                    option.nombre.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  return filtered;
                }}
              />
              <Button 
                size="small" 
                onClick={() => setOpenNuevoProveedor(true)}
                sx={{ 
                  color: '#2ecc71', 
                  alignSelf: 'flex-start',
                  textTransform: 'none'
                }}
              >
                + Agregar nuevo proveedor
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Autocomplete
                options={itemsProveedor}
                getOptionLabel={(option) => option ? `${option.categoria || ''} - ${option.descripcion || ''}` : ''}
                value={formData.item}
                onChange={(event, newValue) => handleInputChange('item', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item"
                    required
                    placeholder="Buscar item..."
                    disabled={!formData.proveedor}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {option.categoria}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.descripcion}
                      </Typography>
                    </Box>
                  </Box>
                )}
                noOptionsText={
                  formData.proveedor ? "No se encontraron items" : "Seleccione un proveedor primero"
                }
                filterOptions={(options, { inputValue }) => {
                  const filtered = options.filter(option =>
                    option.categoria.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.descripcion.toLowerCase().includes(inputValue.toLowerCase())
                  );
                  return filtered;
                }}
              />
              {formData.proveedor && (
                <Button 
                  size="small" 
                  onClick={() => setOpenNuevoItem(true)}
                  sx={{ 
                    color: '#2ecc71', 
                    alignSelf: 'flex-start',
                    textTransform: 'none'
                  }}
                >
                  + Agregar nuevo item
                </Button>
              )}
            </Box>
            
            <TextField
              fullWidth
              label="Partida"
              value={formData.partida}
              onChange={(e) => handleInputChange('partida', e.target.value)}
              required
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Kilos"
                type="number"
                inputProps={{ step: 1, min: 0 }}
                value={formData.kilos}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    handleInputChange('kilos', value);
                  }
                }}
                required
              />
              
              <TextField
                fullWidth
                label="Unidades"
                type="number"
                inputProps={{ step: 1, min: 0 }}
                value={formData.unidades}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    handleInputChange('unidades', value);
                  }
                }}
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Agregando...' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ModalNuevoProveedor 
        open={openNuevoProveedor}
        onClose={() => setOpenNuevoProveedor(false)}
        onProveedorCreado={handleProveedorCreado}
      />

      <ModalAgregarItem 
        open={openNuevoItem}
        onClose={() => setOpenNuevoItem(false)}
        proveedorSeleccionado={formData.proveedor}
        onItemCreado={handleItemCreado}
      />
    </>
  );
};
