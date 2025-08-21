import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { agregarRegistroSalida, limpiarRegistrosSalida, eliminarRegistroSalida } from '../../../../features/salida/model/salidaSlice';
import { 
  selectSalidaRegistros, 
  selectSalidaProveedores, 
  selectSalidaClientes,
  selectSalidaItems, 
  selectSalidaLoading, 
  selectSalidaError 
} from '../../../../features/salida/model/selectors';
import { cargarDatosSalida, enviarRegistrosSalida } from '../../../../features/salida/model/thunks';
import { useSalida } from '../../../../features/salida/hooks/useSalida';
import AutocompleteSelect from '../../../../shared/ui/AutocompleteSelect';
import LoadingInfo from '../../../../shared/ui/LoadingInfo';
import { ModalAgregarCliente } from '../../../../widgets/salida/ModalAgregarCliente';
import { ModalAgregarProveedor } from '../../../../widgets/salida/ModalAgregarProveedor';

// Componente de input compacto
const CompactInput = ({ label, value, onChange, type = "text" }) => (
  <TextField
    fullWidth
    label={label}
    value={value}
    onChange={onChange}
    type={type}
    size="small"
    sx={{ 
      '& .MuiInputBase-root': { 
        height: '28px',
        fontSize: '11px'
      },
      '& .MuiInputLabel-root': {
        fontSize: '10px'
      },
      '& .MuiInputLabel-shrink': {
        fontSize: '9px'
      }
    }}
  />
);

export const GenerarSalidaTab = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const registros = useSelector(selectSalidaRegistros);
  const proveedores = useSelector(selectSalidaProveedores);
  const clientes = useSelector(selectSalidaClientes);
  const items = useSelector(selectSalidaItems);
  const loading = useSelector(selectSalidaLoading);
  const error = useSelector(selectSalidaError);

  // Debug: mostrar datos en consola
  console.log('Estado actual en componente:');
  console.log('Clientes:', clientes);
  console.log('Proveedores:', proveedores);
  console.log('Items:', items);
  console.log('Loading:', loading);
  console.log('Error:', error);
  
  const [formData, setFormData] = useState({
    cliente: '',
    proveedor: '',
    item: '',
    partida: '',
    kilos: '',
    unidades: '',
    rack: '',
    fila: '',
    nivel: '',
    pasillo: ''
  });

  const [enviando, setEnviando] = useState(false);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [modalProveedorOpen, setModalProveedorOpen] = useState(false);

  // Usar el hook personalizado para salida
  console.log('🔄 Llamando useSalida con:', {
    proveedores: proveedores.length,
    items: items.length,
    clientes: clientes.length,
    proveedorSeleccionado: formData.proveedor,
    clienteSeleccionado: formData.cliente
  });
  
  const { itemsFiltrados, filterProveedores, filterClientes, filterItems, isFormValid } = useSalida(
    proveedores, 
    items, 
    clientes,
    formData.proveedor,
    formData.cliente
  );

  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(cargarDatosSalida());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    console.log(`🔄 handleInputChange - field: ${field}, value:`, value);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Si cambia el proveedor, limpiar el item (porque los items dependen del proveedor)
      if (field === 'proveedor') {
        console.log('🔄 Cambió proveedor, limpiando item');
        newData.item = '';
      }
      
      // Si se selecciona una posición rack (rack, fila, nivel), limpiar pasillo
      if (field === 'rack' || field === 'fila' || field === 'nivel') {
        newData.pasillo = '';
      }
      
      // Si se selecciona pasillo, limpiar posición rack
      if (field === 'pasillo') {
        newData.rack = '';
        newData.fila = '';
        newData.nivel = '';
      }
      
      console.log('🔄 Nuevo formData:', newData);
      return newData;
    });
  };

  const handleAgregarRegistro = () => {
    console.log('=== INTENTANDO AGREGAR REGISTRO ===');
    console.log('FormData completo:', formData);
    console.log('FormData cliente:', formData.cliente);
    console.log('FormData proveedor:', formData.proveedor);
    console.log('FormData item:', formData.item);
    console.log('FormData partida:', formData.partida);
    console.log('FormData kilos:', formData.kilos);
    console.log('FormData unidades:', formData.unidades);
    console.log('FormData rack:', formData.rack);
    console.log('FormData fila:', formData.fila);
    console.log('FormData nivel:', formData.nivel);
    console.log('FormData pasillo:', formData.pasillo);
    
    const esValido = isFormValid(formData);
    console.log('¿Formulario válido?', esValido);
    
    if (!esValido) {
      console.log('❌ Formulario no válido, no se puede agregar');
      return;
    }
    
    const nuevoRegistro = {
      id: Date.now(),
      ...formData
    };
    
    console.log('Nuevo registro a agregar:', nuevoRegistro);
    dispatch(agregarRegistroSalida(nuevoRegistro));
    
    // Limpiar el formulario
    setFormData({
      cliente: '',
      proveedor: '',
      item: '',
      partida: '',
      kilos: '',
      unidades: '',
      rack: '',
      fila: '',
      nivel: '',
      pasillo: ''
    });
  };

  const handleEliminarRegistro = (index) => {
    dispatch(eliminarRegistroSalida(index));
  };

  const handleSubmit = async () => {
    if (enviando) return;
    
    setEnviando(true);
    try {
      // Usar el thunk para enviar registros
      const result = await dispatch(enviarRegistrosSalida(registros)).unwrap();
      
      const mensaje = result.success 
        ? `¡Éxito! Se procesaron ${result.registrosProcesados || registros.length} registros de salida correctamente.\n\nSe generaron los movimientos de remitoSalida y consultaRapida correspondientes.`
        : `Procesamiento completado: ${result.message}`;
      
      alert(mensaje);
      // Limpiar los registros después del envío exitoso
      dispatch(limpiarRegistrosSalida());
    } catch (error) {
      console.error('Error al enviar registros de salida:', error);
      alert('Error al enviar los registros de salida. Revisa la consola para más detalles.');
    } finally {
      setEnviando(false);
    }
  };

  const handleLimpiarTodo = () => {
    dispatch(limpiarRegistrosSalida());
  };

  const handleClienteCreado = (nuevoCliente) => {
    // El cliente ya se agregó automáticamente al estado
    // Solo necesitamos cerrar el modal
    setModalClienteOpen(false);
  };

  const handleProveedorCreado = (nuevoProveedor) => {
    // El proveedor ya se agregó automáticamente al estado
    // Solo necesitamos cerrar el modal
    setModalProveedorOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
             <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
         Generar Salida de Materiales
       </Typography>
      
      {/* Formulario de entrada */}
      <LoadingInfo loading={loading} error={error}>
        <Paper sx={{ p: 3, mb: 3, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
          <Typography variant="h6" gutterBottom>
            Nuevo Registro de Salida
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-end' }}>
                         <Box sx={{ flex: '1 1 200px', minWidth: '180px', position: 'relative' }}>
               <AutocompleteSelect
                 label="Cliente"
                 value={formData.cliente}
                 onChange={(value) => handleInputChange('cliente', value)}
                 options={clientes}
                 getOptionLabel={(option) => option.nombre || ''}
                 getOptionKey={(option) => `cliente-${option.id || option.nombre}`}
                 filterOptions={filterClientes}
                 loading={loading}
                 noOptionsText="No hay clientes disponibles"
               />
               <IconButton
                 size="small"
                 onClick={() => setModalClienteOpen(true)}
                 sx={{
                   position: 'absolute',
                   right: 8,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   backgroundColor: 'primary.main',
                   color: 'white',
                   height: '24px',
                   width: '24px',
                   '&:hover': {
                     backgroundColor: 'primary.dark'
                   }
                 }}
               >
                 <PersonAddIcon sx={{ fontSize: '14px' }} />
               </IconButton>
             </Box>
             
             <Box sx={{ flex: '1 1 200px', minWidth: '180px', position: 'relative' }}>
               <AutocompleteSelect
                 label="Proveedor"
                 value={formData.proveedor}
                 onChange={(value) => handleInputChange('proveedor', value)}
                 options={proveedores}
                 getOptionLabel={(option) => option.nombre || ''}
                 getOptionKey={(option) => `proveedor-${option.id || option.nombre}`}
                 filterOptions={filterProveedores}
                 loading={loading}
                 noOptionsText="No hay proveedores disponibles"
               />
               <IconButton
                 size="small"
                 onClick={() => setModalProveedorOpen(true)}
                 sx={{
                   position: 'absolute',
                   right: 8,
                   top: '50%',
                   transform: 'translateY(-50%)',
                   backgroundColor: 'secondary.main',
                   color: 'white',
                   height: '24px',
                   width: '24px',
                   '&:hover': {
                     backgroundColor: 'secondary.dark'
                   }
                 }}
               >
                 <PersonAddIcon sx={{ fontSize: '14px' }} />
               </IconButton>
             </Box>
            
                         <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
               <AutocompleteSelect
                 label="Item"
                 value={formData.item}
                 onChange={(value) => handleInputChange('item', value)}
                 options={itemsFiltrados}
                 getOptionLabel={(option) => `${option.categoria} - ${option.descripcion}` || ''}
                 getOptionKey={(option) => `item-${option.id || `${option.categoria}-${option.descripcion}`}`}
                 filterOptions={filterItems}
                 loading={loading}
                 disabled={!formData.proveedor}
                 noOptionsText={formData.proveedor && itemsFiltrados.length === 0 ? "No hay items disponibles para este proveedor" : "Seleccione un proveedor primero"}
               />
             </Box>
           
            <Box sx={{ flex: '1 1 120px', minWidth: '100px' }}>
              <CompactInput
                label="Partida"
                value={formData.partida}
                onChange={(e) => handleInputChange('partida', e.target.value)}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
              <CompactInput
                label="Kilos"
                type="number"
                value={formData.kilos}
                onChange={(e) => handleInputChange('kilos', e.target.value)}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
              <CompactInput
                label="Unidades"
                type="number"
                value={formData.unidades}
                onChange={(e) => handleInputChange('unidades', e.target.value)}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 80px', minWidth: '70px' }}>
              <CompactInput
                label="Rack"
                value={formData.rack}
                onChange={(e) => handleInputChange('rack', e.target.value)}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 80px', minWidth: '70px' }}>
              <CompactInput
                label="Fila"
                value={formData.fila}
                onChange={(e) => handleInputChange('fila', e.target.value)}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
              <CompactInput
                label="Nivel (AB)"
                value={formData.nivel}
                onChange={(e) => handleInputChange('nivel', e.target.value)}
              />
            </Box>
            
            <Box sx={{ flex: '1 1 100px', minWidth: '80px' }}>
              <CompactInput
                label="Pasillo"
                value={formData.pasillo}
                onChange={(e) => handleInputChange('pasillo', e.target.value)}
              />
            </Box>
            
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="primary"
                onClick={handleAgregarRegistro}
                disabled={!isFormValid(formData)}
                sx={{ 
                  backgroundColor: 'primary.main', 
                  color: 'white',
                  height: '28px',
                  width: '28px',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                <AddIcon sx={{ fontSize: '16px' }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </LoadingInfo>

      {/* Tabla de registros */}
      {registros.length > 0 && (
        <Paper sx={{ p: 3, mb: 3, width: '100%', maxWidth: '100%', overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Registros de Salida ({registros.length})
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleLimpiarTodo}
            >
              Limpiar Todo
            </Button>
          </Box>
          
          <TableContainer>
            <Table size="small">
                             <TableHead>
                 <TableRow>
                   <TableCell>Cliente</TableCell>
                   <TableCell>Proveedor</TableCell>
                   <TableCell>Item</TableCell>
                   <TableCell>Partida</TableCell>
                   <TableCell>Kilos</TableCell>
                   <TableCell>Unidades</TableCell>
                   <TableCell>Rack</TableCell>
                   <TableCell>Fila</TableCell>
                   <TableCell>Nivel</TableCell>
                   <TableCell>Pasillo</TableCell>
                   <TableCell>Acciones</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                                   {registros.map((registro, index) => (
                    <TableRow key={registro.id}>
                      <TableCell>{registro.cliente ? registro.cliente.nombre : ''}</TableCell>
                      <TableCell>{registro.proveedor ? registro.proveedor.nombre : ''}</TableCell>
                      <TableCell>{registro.item ? registro.item.descripcion : ''}</TableCell>
                      <TableCell>{registro.partida}</TableCell>
                      <TableCell>{registro.kilos}</TableCell>
                      <TableCell>{registro.unidades}</TableCell>
                      <TableCell>{registro.rack || '-'}</TableCell>
                      <TableCell>{registro.fila || '-'}</TableCell>
                      <TableCell>{registro.nivel || '-'}</TableCell>
                      <TableCell>{registro.pasillo || '-'}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleEliminarRegistro(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Botón de envío */}
      {registros.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            disabled={enviando}
            sx={{ minWidth: 200 }}
          >
            {enviando ? 'Enviando...' : 'Generar Salida'}
          </Button>
        </Box>
      )}

      {/* Modal para agregar cliente */}
      <ModalAgregarCliente
        open={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        onClienteCreado={handleClienteCreado}
      />

      {/* Modal para agregar proveedor */}
      <ModalAgregarProveedor
        open={modalProveedorOpen}
        onClose={() => setModalProveedorOpen(false)}
        onProveedorCreado={handleProveedorCreado}
      />
    </Box>
  );
};
