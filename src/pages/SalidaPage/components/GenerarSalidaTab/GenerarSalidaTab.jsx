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
import { Add as AddIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon, Error as ErrorIcon } from '@mui/icons-material';
import { agregarRegistroSalida, limpiarRegistrosSalida, eliminarRegistroSalida, marcarRegistroConError, eliminarRegistrosExitosos, marcarRegistrosConErrores, limpiarErroresRegistros } from '../../../../features/salida/model/salidaSlice';
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
    pasillo: '',
    fecha: new Date().toISOString().split('T')[0] // Fecha actual por defecto
  });

  const [enviando, setEnviando] = useState(false);
  const [modalClienteOpen, setModalClienteOpen] = useState(false);
  const [modalProveedorOpen, setModalProveedorOpen] = useState(false);

  // Usar el hook personalizado para salida
  
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
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Si cambia el proveedor, limpiar el item (porque los items dependen del proveedor)
      if (field === 'proveedor') {
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
      
      return newData;
    });
  };

  const handleAgregarRegistro = () => {
    const esValido = isFormValid(formData);
    
    if (!esValido) {
      return;
    }
    
    const nuevoRegistro = {
      id: Date.now(),
      ...formData
    };
    
    dispatch(agregarRegistroSalida(nuevoRegistro));
    
    // Limpiar solo los campos específicos del item, mantener cliente y proveedor
    setFormData(prevData => ({
      ...prevData,
      item: '',
      partida: '',
      kilos: '',
      unidades: '',
      rack: '',
      fila: '',
      nivel: '',
      pasillo: ''
    }));
  };

  const handleEliminarRegistro = (index) => {
    dispatch(eliminarRegistroSalida(index));
  };

  const handleSubmit = async () => {
    if (enviando) return;
    
    setEnviando(true);
    try {
      // Usar el thunk para enviar registros
      const resultado = await dispatch(enviarRegistrosSalida(registros)).unwrap();
      
      if (resultado.totalErrores === 0) {
        alert(`¡Éxito! Se procesaron ${resultado.totalExitosos} registros de salida correctamente.`);
        // Limpiar los registros después del envío exitoso
        dispatch(limpiarRegistrosSalida());
      } else {
                 // Procesar resultados mixtos (algunos exitosos, algunos con errores)
         
         // Eliminar registros que se procesaron exitosamente
         if (resultado.exitosos && resultado.exitosos.length > 0) {
           dispatch(eliminarRegistrosExitosos({ exitosos: resultado.exitosos }));
         }
        
                 // Marcar registros que fallaron con sus errores específicos
         if (resultado.errores && resultado.errores.length > 0) {
           dispatch(marcarRegistrosConErrores({ errores: resultado.errores }));
           
           // Mostrar mensaje informativo más detallado
           let mensaje = `✅ Se procesaron ${resultado.totalExitosos} registros exitosamente.\n\n`;
           mensaje += `❌ ${resultado.totalErrores} registros fallaron y permanecen en la lista.\n\n`;
           mensaje += `📋 Los registros con errores muestran detalles específicos del problema.\n`;
           mensaje += `🔧 Puede corregir los datos y reintentar el envío.`;
           
           alert(mensaje);
         }
      }
         } catch (error) {
       alert('Error al enviar los registros de salida. Por favor intente nuevamente.');
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
                 placeholder={!formData.proveedor ? "Seleccione un proveedor primero" : "Seleccione un item"}
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
            
            <Box sx={{ flex: '1 1 120px', minWidth: '100px' }}>
              <CompactInput
                label="Fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
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
                         <Box sx={{ display: 'flex', gap: 1 }}>
               <Button 
                 variant="outlined" 
                 color="warning" 
                 onClick={() => dispatch(limpiarErroresRegistros())}
                 disabled={!registros.some(r => r.tieneError)}
               >
                 Limpiar Errores
               </Button>
               <Button 
                 variant="outlined" 
                 color="error" 
                 onClick={handleLimpiarTodo}
               >
                 Limpiar Todo
               </Button>
             </Box>
          </Box>
          
          <TableContainer>
            <Table size="small">
                             <TableHead>
                 <TableRow>
                   <TableCell>Estado</TableCell>
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
                   <TableCell>Fecha</TableCell>
                   <TableCell>Acciones</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {registros.map((registro, index) => (
                   <React.Fragment key={registro.id}>
                     <TableRow 
                       sx={{
                         backgroundColor: registro.tieneError ? 'error.light' : 'inherit',
                         '&:hover': {
                           backgroundColor: registro.tieneError ? 'error.light' : 'action.hover'
                         }
                       }}
                     >
                       <TableCell>
                         {registro.tieneError ? (
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <ErrorIcon color="error" sx={{ fontSize: '16px' }} />
                             <Typography variant="caption" color="error">
                               Error
                             </Typography>
                           </Box>
                         ) : (
                           <Typography variant="caption" color="success.main">
                             ✓ OK
                           </Typography>
                         )}
                       </TableCell>
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
                       <TableCell>{registro.fecha || '-'}</TableCell>
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
                     {registro.tieneError && (
                       <TableRow>
                         <TableCell colSpan={13}>
                           <Box sx={{ 
                             backgroundColor: 'error.light', 
                             p: 1, 
                             borderRadius: 1,
                             border: '1px solid',
                             borderColor: 'error.main',
                             mx: 1
                           }}>
                                                         <Typography variant="caption" color="error" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                              ❌ {registro.error}
                            </Typography>
                             {registro.stockDisponible && (
                               <Typography variant="caption" display="block" color="error" sx={{ mb: 0.5 }}>
                                 📊 Stock disponible: {registro.stockDisponible.kilos} kilos, {registro.stockDisponible.unidades} unidades
                               </Typography>
                             )}
                             {registro.stockSolicitado && (
                               <Typography variant="caption" display="block" color="error" sx={{ mb: 0.5 }}>
                                 📋 Stock solicitado: {registro.stockSolicitado.kilos} kilos, {registro.stockSolicitado.unidades} unidades
                               </Typography>
                             )}
                           </Box>
                         </TableCell>
                       </TableRow>
                     )}
                   </React.Fragment>
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
