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
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Check as CheckIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { dashboardComprasService } from '../../services/dashboardComprasService';

export const ConfiguracionTarjetaModal = ({ 
  open, 
  onClose, 
  tarjeta, 
  onConfiguracionGuardada 
}) => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [items, setItems] = useState([]);
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [itemsConfigurados, setItemsConfigurados] = useState([]); // Para items ya configurados
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      cargarProveedores();
      if (tarjeta?.itemIds) {
        setItemsSeleccionados(tarjeta.itemIds);
        cargarItemsConfigurados(tarjeta.itemIds);
      }
    }
  }, [open, tarjeta]);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await dashboardComprasService.obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      setError('Error al cargar proveedores');
      console.error('Error cargando proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarItemsPorProveedor = async (proveedorId) => {
    try {
      setLoadingItems(true);
      const data = await dashboardComprasService.obtenerItemsPorProveedor(proveedorId);
      setItems(data);
    } catch (error) {
      setError('Error al cargar items del proveedor');
      console.error('Error cargando items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const cargarItemsConfigurados = async (itemIds) => {
    if (!itemIds || itemIds.length === 0) {
      setItemsConfigurados([]);
      return;
    }

    try {
      // Obtener todos los proveedores para buscar los items
      const proveedoresData = await dashboardComprasService.obtenerProveedores();
      const itemsConfiguradosData = [];

      // Buscar cada item en todos los proveedores
      for (const itemId of itemIds) {
        for (const proveedor of proveedoresData) {
          try {
            const itemsProveedor = await dashboardComprasService.obtenerItemsPorProveedor(proveedor.id);
            const item = itemsProveedor.find(i => i.id === itemId);
            if (item) {
              itemsConfiguradosData.push({
                ...item,
                proveedor: proveedor
              });
              break; // Encontramos el item, salimos del loop de proveedores
            }
          } catch (error) {
            console.error(`Error buscando item ${itemId} en proveedor ${proveedor.id}:`, error);
          }
        }
      }

      setItemsConfigurados(itemsConfiguradosData);
    } catch (error) {
      console.error('Error cargando items configurados:', error);
    }
  };

  const handleProveedorChange = (event) => {
    const proveedorId = event.target.value;
    setProveedorSeleccionado(proveedorId);
    if (proveedorId) {
      cargarItemsPorProveedor(proveedorId);
    } else {
      setItems([]);
    }
  };

  const handleItemToggle = (itemId) => {
    setItemsSeleccionados(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);
      setError('');
      
      await dashboardComprasService.actualizarConfiguracion(
        tarjeta.id, 
        itemsSeleccionados
      );
      
      onConfiguracionGuardada?.(tarjeta.id, itemsSeleccionados);
      onClose();
    } catch (error) {
      setError('Error al guardar la configuración');
      console.error('Error guardando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProveedorSeleccionado('');
    setItems([]);
    setItemsSeleccionados(tarjeta?.itemIds || []);
    setError('');
    onClose();
  };

  const getProveedorNombre = (proveedorId) => {
    const proveedor = proveedores.find(p => p.id === proveedorId);
    return proveedor?.nombre || 'Proveedor no encontrado';
  };

  const getItemInfo = (itemId) => {
    // Primero buscar en items configurados (que tienen info completa)
    const itemConfigurado = itemsConfigurados.find(i => i.id === itemId);
    if (itemConfigurado) {
      return {
        descripcion: itemConfigurado.descripcion,
        categoria: itemConfigurado.categoria,
        proveedor: itemConfigurado.proveedor?.nombre
      };
    }
    
    // Si no está en configurados, buscar en items actuales
    const item = items.find(i => i.id === itemId);
    if (item) {
      return {
        descripcion: item.descripcion,
        categoria: item.categoria,
        proveedor: getProveedorNombre(item.proveedor?.id)
      };
    }
    
    return {
      descripcion: 'Item no encontrado',
      categoria: 'N/A',
      proveedor: 'N/A'
    };
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Configurar {tarjeta?.nombreTarjeta}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Información de la tarjeta */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Información de la tarjeta:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`Categoría: ${tarjeta?.categoria}`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`Color: ${tarjeta?.color}`} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
            <Chip 
              label={`Items configurados: ${itemsSeleccionados.length}`} 
              size="small" 
              color="info" 
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Selector de proveedor */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            <BusinessIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            Seleccionar Proveedor
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={proveedorSeleccionado}
              onChange={handleProveedorChange}
              label="Proveedor"
              disabled={loading}
            >
              {proveedores.map((proveedor) => (
                <MenuItem key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Lista de items */}
        {proveedorSeleccionado && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              <InventoryIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
              Items del Proveedor
            </Typography>

            {loadingItems ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <List sx={{ 
                bgcolor: 'grey.50', 
                borderRadius: 2,
                maxHeight: 300,
                overflow: 'auto'
              }}>
                {items.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No hay items disponibles para este proveedor"
                      sx={{ textAlign: 'center', color: 'text.secondary' }}
                    />
                  </ListItem>
                ) : (
                  items.map((item) => (
                    <ListItem key={item.id} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={itemsSeleccionados.includes(item.id)}
                          onChange={() => handleItemToggle(item.id)}
                          color="primary"
                        />
                      </ListItemIcon>
                                             <ListItemText
                         primary={item.descripcion}
                         secondary={`Categoría: ${item.categoria} | Proveedor: ${getProveedorNombre(item.proveedor?.id)}`}
                       />
                    </ListItem>
                  ))
                )}
              </List>
            )}
          </Box>
        )}

        {/* Items ya seleccionados de otros proveedores */}
        {itemsSeleccionados.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Items Configurados Actualmente
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                               {itemsSeleccionados.map((itemId) => {
                   const itemInfo = getItemInfo(itemId);
                   return (
                     <Chip
                       key={itemId}
                       label={`${itemInfo.proveedor} - ${itemInfo.descripcion}`}
                       onDelete={() => handleItemToggle(itemId)}
                       color="success"
                       variant="outlined"
                       size="small"
                       icon={<CheckIcon />}
                     />
                   );
                 })}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleGuardar} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
