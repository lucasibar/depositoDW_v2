import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Autocomplete
} from '@mui/material';
import { dataProveedoresItems } from '../../../features/remitos/model/slice';
import { ModalAgregarItem } from '../ModalAgregarItem/ModalAgregarItem';
import axios from 'axios';
import styles from './AdicionRapidaForm.module.css';

const URL = "https://derwill-deposito-backend.onrender.com";

// Categorías para nuevos items
const CATEGORIAS = [
  "poliester", "costura", "algodon", "algodon-color", "nylon", "nylon REC", "nylon-color", "lycra", "lycra REC", 
  "goma", "tarugo", "etiqueta", "bolsa", "percha", "ribbon", "caja", 
  "cinta", "plantilla", "film", "consumibes(aceite y parafina)", "faja", "caballete"
];

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

export const AdicionRapidaForm = ({ open, onClose, posicion, onSubmit }) => {
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

  // Limpiar item cuando cambie el proveedor
  useEffect(() => {
    if (formData.proveedor && formData.item) {
      // Verificar si el item actual pertenece al proveedor seleccionado
      const itemPerteneceAlProveedor = formData.item.proveedor?.id === formData.proveedor.id;
      if (!itemPerteneceAlProveedor) {
        setFormData(prev => ({
          ...prev,
          item: ''
        }));
      }
    }
  }, [formData.proveedor]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Si se cambia el proveedor, resetear el item seleccionado
      if (field === 'proveedor') {
        newData.item = '';
      }
      
      return newData;
    });
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
        posicion: posicion?.id || posicion?.posicionId || ''
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

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Adición Rápida - {posicion?.pasillo 
            ? `Pasillo ${posicion.pasillo}`
            : `Rack ${posicion?.rack} - Fila ${posicion?.fila} - Nivel ${posicion?.AB}`
          }
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
                  // Si no hay texto de búsqueda, mostrar todas las opciones
                  if (!inputValue || !inputValue.trim()) {
                    return options;
                  }
                  
                  const searchText = inputValue.toLowerCase().trim();
                  
                  // Filtrar items que contengan el texto de búsqueda en categoría o descripción
                  return options.filter(option => {
                    const categoria = (option.categoria || '').toLowerCase();
                    const descripcion = (option.descripcion || '').toLowerCase();
                    
                    return categoria.includes(searchText) || descripcion.includes(searchText);
                  });
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