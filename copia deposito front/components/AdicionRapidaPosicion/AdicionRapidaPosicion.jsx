import React, { useState, useEffect, useMemo } from 'react';
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
import { createItemsFilter, createProveedoresFilter } from '../../shared/utils/filterUtils';
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
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Filtrar items por proveedor seleccionado
  const itemsProveedor = useMemo(() => {
    if (!formData.proveedor || !allItems || allItems.length === 0) {
      return [];
    }

    console.log('🔍 Filtrando items para proveedor:', formData.proveedor);
    console.log('📦 Total de items disponibles:', allItems.length);
    
    const itemsFiltrados = allItems.filter(item => {
      // Verificar que el item tenga proveedor
      if (!item.proveedor) {
        console.log('⚠️ Item sin proveedor:', item);
        return false;
      }

      // Comparar IDs (tanto string como number)
      const itemProveedorId = String(item.proveedor.id);
      const proveedorSeleccionadoId = String(formData.proveedor.id);
      
      const coincide = itemProveedorId === proveedorSeleccionadoId;
      
      if (coincide) {
        console.log('✅ Item coincide:', item.categoria, '-', item.descripcion);
      }
      
      return coincide;
    });

    console.log('🎯 Items filtrados encontrados:', itemsFiltrados.length);
    return itemsFiltrados;
  }, [formData.proveedor, allItems]);

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
            
            {/* Botón de depuración */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
              <Button 
                size="small" 
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                sx={{ 
                  color: '#666', 
                  textTransform: 'none',
                  fontSize: '0.75rem'
                }}
              >
                {showDebugInfo ? 'Ocultar' : 'Mostrar'} Info Debug
              </Button>
            </Box>
            
            {/* Información de depuración */}
            {showDebugInfo && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" component="div">
                  <strong>Debug Info:</strong><br/>
                  • Proveedores cargados: {proveedores?.length || 0}<br/>
                  • Items totales: {allItems?.length || 0}<br/>
                  • Items para proveedor seleccionado: {itemsProveedor.length}<br/>
                  {formData.proveedor && (
                    <>
                      • Proveedor seleccionado: {formData.proveedor.nombre} (ID: {formData.proveedor.id})<br/>
                    </>
                  )}
                </Typography>
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
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={option.id || `proveedor-${option.nombre}`} {...otherProps}>
                      {option.nombre}
                    </Box>
                  );
                }}
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
              {formData.proveedor && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {itemsProveedor.length > 0 
                    ? `${itemsProveedor.length} item${itemsProveedor.length !== 1 ? 's' : ''} disponible${itemsProveedor.length !== 1 ? 's' : ''} para ${formData.proveedor.nombre}`
                    : `No hay items disponibles para ${formData.proveedor.nombre}`
                  }
                </Typography>
              )}
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
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={option.id || `item-${option.categoria}-${option.descripcion}`} {...otherProps}>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {option.categoria}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {option.descripcion}
                        </Typography>
                      </Box>
                    </Box>
                  );
                }}
                noOptionsText={
                  formData.proveedor ? "No se encontraron items" : "Seleccione un proveedor primero"
                }
                filterOptions={(options, { inputValue }) => {
                  // Si no hay texto de búsqueda, mostrar todas las opciones
                  if (!inputValue || !inputValue.trim()) {
                    return options;
                  }
                  
                  // Dividir la búsqueda en palabras individuales
                  const searchWords = inputValue.toLowerCase().trim().split(' ').filter(word => word.length > 0);
                  
                  // Filtrar items que contengan TODAS las palabras de búsqueda
                  return options.filter(option => {
                    if (!option) return false;
                    
                    const itemText = `${option.categoria || ''} ${option.descripcion || ''}`.toLowerCase();
                    
                    // Verificar que TODAS las palabras estén presentes
                    return searchWords.every(word => itemText.includes(word));
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
