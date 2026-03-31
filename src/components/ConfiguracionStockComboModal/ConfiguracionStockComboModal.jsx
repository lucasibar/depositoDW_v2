import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  ColorLens as ColorIcon
} from '@mui/icons-material';
import { dashboardStockService } from '../../services/dashboardStockService';
import { dashboardComprasService } from '../../services/dashboardComprasService';

export const ConfiguracionStockComboModal = ({
  open,
  onClose,
  combo,
  onConfigSaved
}) => {
  const [nombreCombo, setNombreCombo] = useState('');
  const [color, setColor] = useState('#3f51b5');
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [items, setItems] = useState([]);
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [itemsDetalles, setItemsDetalles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      cargarProveedores();
      if (combo) {
        setNombreCombo(combo.nombreCombo || '');
        setColor(combo.color || '#3f51b5');
        setItemsSeleccionados(combo.itemIds || []);
        if (combo.itemIds?.length > 0) {
          cargarDetallesItems(combo.itemIds);
        }
      } else {
        setNombreCombo('');
        setColor('#3f51b5');
        setItemsSeleccionados([]);
        setItemsDetalles([]);
      }
    }
  }, [open, combo]);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await dashboardComprasService.obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const cargarDetallesItems = async (itemIds) => {
    try {
      const details = await dashboardComprasService.obtenerDetallesItems(itemIds);
      setItemsDetalles(details);
    } catch (error) {
      console.error('Error cargando detalles de items:', error);
    }
  };

  const cargarItemsPorProveedor = async (proveedorId) => {
    try {
      setLoadingItems(true);
      const data = await dashboardComprasService.obtenerItemsPorProveedor(proveedorId);
      setItems(data);
      
      const selectedDetailsFromSource = data.filter(i => itemsSeleccionados.includes(i.id));
      if (selectedDetailsFromSource.length > 0) {
        setItemsDetalles(prev => {
          const filtered = prev.filter(p => !selectedDetailsFromSource.find(s => s.id === p.id));
          return [...filtered, ...selectedDetailsFromSource];
        });
      }
    } catch (error) {
      setError('Error al cargar items');
    } finally {
      setLoadingItems(false);
    }
  };

  const handleProveedorChange = (event) => {
    const proveedorId = event.target.value;
    setProveedorSeleccionado(proveedorId);
    if (proveedorId) {
      cargarItemsPorProveedor(proveedorId);
    }
  };

  const handleItemToggle = (item) => {
    const itemId = typeof item === 'string' ? item : item.id;
    setItemsSeleccionados(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });

    if (typeof item === 'object') {
       setItemsDetalles(prev => {
         if (prev.find(i => i.id === item.id)) return prev;
         return [...prev, item];
       });
    }
  };

  const getItemLabel = (id) => {
    const item = itemsDetalles.find(i => i.id === id) || items.find(i => i.id === id);
    if (!item) return id;
    const provName = item.proveedor?.nombre || item.proveedorNombre || '';
    return `${provName ? provName + ' - ' : ''}${item.descripcion}`;
  };

  const handleGuardar = async () => {
    if (!nombreCombo.trim()) {
      setError('El nombre del combo es obligatorio');
      return;
    }

    try {
      setLoading(true);
      const data = {
        nombreCombo,
        color,
        itemIds: itemsSeleccionados,
        activo: true
      };

      if (combo?.id) {
        await dashboardStockService.actualizarConfig(combo.id, data);
      } else {
        await dashboardStockService.crearConfig(data);
      }

      onConfigSaved?.();
      onClose();
    } catch (error) {
      setError('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>Configurar Combo de Stock</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Nombre del Combo"
            value={nombreCombo}
            onChange={(e) => setNombreCombo(e.target.value)}
            placeholder="Ej: Hilado Blanco"
          />
          <TextField
            label="Color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            sx={{ width: 100 }}
            InputProps={{ startAdornment: <ColorIcon sx={{ mr: 1, fontSize: '1rem' }} /> }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>1. Seleccionar Proveedor</Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Proveedor</InputLabel>
            <Select value={proveedorSeleccionado} onChange={handleProveedorChange} label="Proveedor">
              {proveedores.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {proveedorSeleccionado && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={700}>2. Seleccionar Items</Typography>
              <TextField 
                size="small" 
                variant="standard" 
                placeholder="Filtrar items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} /> }}
              />
            </Box>
            <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'grey.50', borderRadius: 1 }}>
              {filteredItems.map(item => (
                <ListItem key={item.id} dense button onClick={() => handleItemToggle(item)}>
                  <ListItemIcon><Checkbox checked={itemsSeleccionados.includes(item.id)} edge="start" /></ListItemIcon>
                  <ListItemText primary={item.descripcion} secondary={item.categoria} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Items seleccionados ({itemsSeleccionados.length})</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {itemsSeleccionados.length === 0 && <Typography variant="caption" color="text.secondary">Ningún item seleccionado</Typography>}
            {itemsSeleccionados.map(id => (
              <Chip 
                key={id} 
                label={getItemLabel(id)} 
                size="small" 
                onDelete={() => handleItemToggle(id)} 
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Guardar Combo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
