import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { createOrdenPedido, clearOrdenACopiar } from '../../../../features/ordenesPedido/model/slice';
import { dataProveedoresItems } from '../../../../features/remitos/model/slice';
import { selectProveedores, selectItems, selectOrdenesPedidoLoading, selectOrdenesPedidoError, selectOrdenACopiar } from '../../../../features/ordenesPedido/model/selectors';
import { ModalAgregarProveedor } from '../../../../widgets/remitos/ModalAgregarProveedor/ModalAgregarProveedor';
import { ModalAgregarItem } from '../../../../widgets/remitos/ModalAgregarItem/ModalAgregarItem';
import AutocompleteSelect from '../../../../shared/ui/AutocompleteSelect';

// Función para obtener la fecha actual en formato YYYY-MM-DD sin problemas de timezone
const getCurrentDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const GenerarOrdenPedidoTab = ({ params = {} }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const proveedores = useSelector(selectProveedores);
  const items = useSelector(selectItems);
  const isLoading = useSelector(selectOrdenesPedidoLoading);
  const error = useSelector(selectOrdenesPedidoError);
  const ordenACopiar = useSelector(selectOrdenACopiar);
  
  // Estados para el formulario simplificado
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [kilos, setKilos] = useState('');
  const [fechaOrden, setFechaOrden] = useState(getCurrentDateString());
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  
  // Estado para la lista de items
  const [itemsLista, setItemsLista] = useState([]);
  const [editandoKilos, setEditandoKilos] = useState(null);
  const [nuevoKilos, setNuevoKilos] = useState('');

  // Cargar datos al montar
  useEffect(() => {
    dispatch(dataProveedoresItems());
  }, [dispatch]);

  // Cargar orden a copiar cuando esté disponible
  useEffect(() => {
    if (ordenACopiar) {
      // Cargar datos de la orden a copiar
      setSelectedCliente(ordenACopiar.proveedor?.id || '');
      setFechaOrden(getCurrentDateString());
      
      // Cargar todos los items de la orden a copiar
      if (ordenACopiar.items && ordenACopiar.items.length > 0) {
        const itemsParaLista = ordenACopiar.items.map(item => ({
          id: item.id,
          item: item.item,
          kilos: item.kilos
        }));
        setItemsLista(itemsParaLista);
      }
      
      // Limpiar la orden a copiar después de cargarla
      dispatch(clearOrdenACopiar());
    }
  }, [ordenACopiar, dispatch]);

  // Manejar parámetros de copia desde props
  useEffect(() => {
    if (params.ordenACopiar) {
      setSelectedCliente(params.ordenACopiar.proveedor?.id || '');
      setFechaOrden(getCurrentDateString());
      
      if (params.ordenACopiar.items && params.ordenACopiar.items.length > 0) {
        const itemsParaLista = params.ordenACopiar.items.map(item => ({
          id: item.id,
          item: item.item,
          kilos: item.kilos
        }));
        setItemsLista(itemsParaLista);
      }
    }
  }, [params]);

  // Filtrar clientes (solo categoría 'cliente')
  const filteredClientes = proveedores.filter(prov => prov.categoria === 'cliente');

  // Filtrar proveedores (solo categoría 'proveedor') para filtrar items
  const filteredProveedores = proveedores.filter(prov => prov.categoria === 'proveedor');

  // Filtrar items por proveedor seleccionado
  const filteredItems = selectedProveedor 
    ? items.filter(item => {
        const isItem = item.descripcion && !item.nombre;
        if (!isItem) return false;

        let matchesProveedor = false;
        if (item.proveedor) {
          if (item.proveedor.id) {
            matchesProveedor = item.proveedor.id === selectedProveedor.id;
          } else if (item.proveedor.nombre) {
            matchesProveedor = item.proveedor.nombre === selectedProveedor.nombre;
          }
        }
        return matchesProveedor;
      })
    : [];

  const handleProveedorCreado = (nuevoProveedor) => {
    dispatch(dataProveedoresItems());
    setSelectedProveedor(nuevoProveedor);
  };

  const handleItemCreado = (nuevoItem) => {
    dispatch(dataProveedoresItems());
    setSelectedItem(nuevoItem);
  };

  // Función para agregar item a la lista
  const handleAgregarItem = () => {
    if (!selectedItem || !kilos) {
      alert('Por favor seleccione un item e ingrese los kilos');
      return;
    }

    // Verificar si el item ya está en la lista
    const itemExistente = itemsLista.find(item => item.id === selectedItem.id);
    if (itemExistente) {
      alert('Este item ya está en la lista');
      return;
    }

    const nuevoItem = {
      id: selectedItem.id,
      item: selectedItem,
      kilos: parseFloat(kilos)
    };

    setItemsLista([...itemsLista, nuevoItem]);
    
    // Limpiar campos del formulario
    setSelectedItem(null);
    setKilos('');
  };

  // Función para eliminar item de la lista
  const handleEliminarItem = (itemId) => {
    setItemsLista(itemsLista.filter(item => item.id !== itemId));
  };

  // Función para iniciar edición de kilos
  const handleEditarKilos = (itemId, kilosActuales) => {
    setEditandoKilos(itemId);
    setNuevoKilos(kilosActuales.toString());
  };

  // Función para guardar kilos editados
  const handleGuardarKilos = () => {
    if (editandoKilos && nuevoKilos) {
      setItemsLista(itemsLista.map(item => 
        item.id === editandoKilos 
          ? { ...item, kilos: parseFloat(nuevoKilos) }
          : item
      ));
      setEditandoKilos(null);
      setNuevoKilos('');
    }
  };

  // Función para cancelar edición de kilos
  const handleCancelarEdicion = () => {
    setEditandoKilos(null);
    setNuevoKilos('');
  };

  const handleSubmit = async () => {
    if (!selectedCliente || !fechaOrden || itemsLista.length === 0) {
      alert('Por favor complete todos los campos obligatorios y agregue al menos un item');
      return;
    }

    const clienteSeleccionado = proveedores.find(prov => prov.id === selectedCliente);
    
    const ordenData = {
      clienteSeleccionado: clienteSeleccionado,
      fechaSeleccionado: fechaOrden,
      numeroOrdenSeleccionado: `ORD-${Date.now()}`, // Se genera automáticamente
      partidasOrden: itemsLista.map(item => ({
        kilos: item.kilos,
        item: item.item
      }))
    };

    try {
      await dispatch(createOrdenPedido(ordenData));
      
      // Limpiar formulario después del éxito
      setSelectedCliente('');
      setSelectedProveedor(null);
      setSelectedItem(null);
      setKilos('');
      setFechaOrden(getCurrentDateString());
      setItemsLista([]);
      
      alert('Orden de pedido creada exitosamente');
    } catch (error) {
      console.error('Error al crear orden de pedido:', error);
    }
  };

  const handleClear = () => {
    setSelectedCliente('');
    setSelectedProveedor(null);
    setSelectedItem(null);
    setKilos('');
    setFechaOrden(new Date().toISOString().split('T')[0]);
    setItemsLista([]);
  };

  if (isLoading && (!proveedores || proveedores.length === 0)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Formulario Principal */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generar Orden de Pedido
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Complete los campos para crear una nueva orden de pedido
          </Typography>

          <Grid container spacing={3}>
            {/* Fecha */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fecha de la Orden"
                type="date"
                value={fechaOrden}
                onChange={(e) => setFechaOrden(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Cliente */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={selectedCliente}
                  label="Cliente"
                  onChange={(e) => setSelectedCliente(e.target.value)}
                >
                  {filteredClientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Proveedor para filtrar items */}
            <Grid item xs={12} sm={6}>
              <AutocompleteSelect
                label="Proveedor (para filtrar items)"
                value={selectedProveedor}
                onChange={(proveedor) => {
                  setSelectedProveedor(proveedor);
                  setSelectedItem(null); // Limpiar item cuando cambie el proveedor
                }}
                options={filteredProveedores}
                getOptionLabel={(option) => option.nombre}
                getOptionKey={(option) => option.id}
                size="medium"
                sx={{ width: '100%' }}
              />
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setShowProveedorModal(true)}
                  variant="outlined"
                >
                  Agregar Proveedor
                </Button>
              </Box>
            </Grid>

            {/* Item */}
            <Grid item xs={12} sm={6}>
              <AutocompleteSelect
                label="Item"
                value={selectedItem}
                onChange={(item) => setSelectedItem(item)}
                options={filteredItems}
                getOptionLabel={(option) => `${option.descripcion} - ${option.categoria}`}
                getOptionKey={(option) => option.id}
                size="medium"
                sx={{ width: '100%' }}
                disabled={!selectedProveedor}
              />
              <Box sx={{ mt: 1 }}>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setShowItemModal(true)}
                  variant="outlined"
                  disabled={!selectedProveedor}
                >
                  Agregar Item
                </Button>
              </Box>
            </Grid>

            {/* Kilos */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Kilos"
                type="number"
                value={kilos}
                onChange={(e) => setKilos(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
                required
                disabled={!selectedItem}
              />
            </Grid>

            {/* Botón Agregar Item */}
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAgregarItem}
                disabled={!selectedItem || !kilos}
                sx={{ height: '56px' }}
              >
                Agregar
              </Button>
            </Grid>

            {/* Botones de Acción */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  Limpiar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedCliente || itemsLista.length === 0}
                >
                  {isLoading ? 'Creando...' : 'Crear Orden'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de Items Agregados */}
      {itemsLista.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Items en la Orden ({itemsLista.length})
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Kilos</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsLista.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {item.item.descripcion}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.item.categoria} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {editandoKilos === item.id ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                              size="small"
                              type="number"
                              value={nuevoKilos}
                              onChange={(e) => setNuevoKilos(e.target.value)}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 80 }}
                            />
                            <IconButton
                              size="small"
                              color="success"
                              onClick={handleGuardarKilos}
                            >
                              <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={handleCancelarEdicion}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': { 
                                backgroundColor: 'action.hover',
                                borderRadius: 1,
                                px: 1
                              }
                            }}
                            onClick={() => handleEditarKilos(item.id, item.kilos)}
                          >
                            {item.kilos} kg
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleEliminarItem(item.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      <ModalAgregarProveedor 
        open={showProveedorModal}
        onClose={() => setShowProveedorModal(false)}
        onProveedorCreado={handleProveedorCreado}
      />
      
      <ModalAgregarItem 
        open={showItemModal}
        onClose={() => setShowItemModal(false)}
        onItemCreado={handleItemCreado}
        proveedorSeleccionado={selectedProveedor}
      />
    </Box>
  );
};