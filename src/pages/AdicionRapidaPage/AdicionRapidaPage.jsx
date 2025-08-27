import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Grid,
  TextField,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { agregarRegistro, limpiarRegistros, eliminarRegistro } from '../../features/adicionesRapidas/model/slice';
import { 
  selectAdicionesRapidas, 
  selectProveedores, 
  selectItems, 
  selectAdicionesRapidasLoading, 
  selectAdicionesRapidasError 
} from '../../features/adicionesRapidas/model/selectors';
import { cargarDatosIniciales, enviarAdicionRapida } from '../../features/adicionesRapidas/model/thunks';
import { useAdicionRapida } from '../../features/adicionesRapidas/hooks/useAdicionRapida';
import AutocompleteSelect from '../../shared/ui/AutocompleteSelect';
import LoadingInfo from '../../shared/ui/LoadingInfo';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../../config/api';

// Categorías disponibles para nuevos items
const CATEGORIAS = [
  "costura", "algodon", "algodon-color", "nylon", "nylon REC", "nylon-color", "lycra", "lycra REC", 
  "goma", "tarugo", "etiqueta", "bolsa", "percha", "ribbon", "caja", 
  "cinta", "plantilla", "film", "consumibes(aceite y parafina)", "faja", "caballete"
];

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

export const AdicionRapidaPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registros = useSelector(selectAdicionesRapidas);
  const proveedores = useSelector(selectProveedores);
  const items = useSelector(selectItems);
  const loading = useSelector(selectAdicionesRapidasLoading);
  const error = useSelector(selectAdicionesRapidasError);
  
  const [formData, setFormData] = useState({
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
  const [user, setUser] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  // Estados para el modal de nuevo item
  const [openNuevoItem, setOpenNuevoItem] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({
    descripcion: '',
    categoria: ''
  });
  const [creandoItem, setCreandoItem] = useState(false);
  const [errorItem, setErrorItem] = useState('');

  // Usar el hook personalizado
  const { itemsFiltrados, filterProveedores, filterItems, isFormValid } = useAdicionRapida(
    proveedores, 
    items, 
    formData.proveedor
  );

  // Cargar datos al montar el componente
  useEffect(() => {
    dispatch(cargarDatosIniciales());
  }, [dispatch]);

  // Inicialización y autenticación
  useEffect(() => {
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleInputChange = (field, value) => {
    // Limpiar error de validación cuando el usuario comience a completar campos
    if (validationError) {
      setValidationError('');
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Si cambia el proveedor, limpiar el item
      if (field === 'proveedor') {
        newData.item = '';
      }
      
      // Si se ingresa un pasillo, limpiar rack, fila y nivel
      if (field === 'pasillo' && value && value.trim() !== '') {
        newData.rack = '';
        newData.fila = '';
        newData.nivel = '';
      }
      
      // Si se ingresa rack, fila o nivel, limpiar pasillo
      if ((field === 'rack' || field === 'fila' || field === 'nivel') && value && value.trim() !== '') {
        newData.pasillo = '';
      }
      
      return newData;
    });
  };

  const handleAgregarRegistro = () => {
    // Limpiar error anterior
    setValidationError('');
    
    // Validar antes de agregar
    if (!isFormValid(formData)) {
      setValidationError('Completa todos los campos obligatorios antes de agregar');
      return;
    }
    
    console.log('Agregando registro:', formData);
    console.log('Registros actuales:', registros);
    
    // Obtener los nombres/descripciones para mostrar en la tabla
    const proveedorNombre = typeof formData.proveedor === 'object' ? formData.proveedor.nombre : formData.proveedor;
    const itemDescripcion = typeof formData.item === 'object' ? `${formData.item.categoria} - ${formData.item.descripcion}` : formData.item;
    
    const nuevoRegistro = {
      id: Date.now(),
      ...formData,
      proveedor: proveedorNombre, // Guardar solo el nombre para la tabla
      item: itemDescripcion // Guardar solo la descripción para la tabla
    };
    
    console.log('Nuevo registro a agregar:', nuevoRegistro);
    
    dispatch(agregarRegistro(nuevoRegistro));
    
    // Limpiar el formulario
    setFormData({
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
    
    console.log('Formulario limpiado');
  };

  const handleEliminarRegistro = (index) => {
    dispatch(eliminarRegistro(index));
  };

  const handleSubmit = async () => {
    if (enviando) return;
    
    setEnviando(true);
    try {
      // Preparar los registros con los IDs correctos para el backend
      const registrosParaEnviar = registros.map(registro => {
        // Buscar el proveedor original por nombre
        const proveedorOriginal = proveedores.find(p => p.nombre === registro.proveedor);
        // Buscar el item original por descripción
        const itemOriginal = items.find(i => `${i.categoria} - ${i.descripcion}` === registro.item);
        
        return {
          ...registro,
          // Convertir kilos y unidades a números
          kilos: parseFloat(registro.kilos) || 0,
          unidades: parseInt(registro.unidades) || 0,
          proveedorId: proveedorOriginal?.id || null,
          itemId: itemOriginal?.id || null
        };
      });
      
      const resultado = await dispatch(enviarAdicionRapida(registrosParaEnviar)).unwrap();
      
      if (resultado.totalErrores === 0) {
        alert(`¡Éxito! Se procesaron ${resultado.totalExitosos} registros correctamente.`);
        // Limpiar los registros después del envío exitoso
        dispatch(limpiarRegistros());
      } else {
        alert(`Se procesaron ${resultado.totalExitosos} registros exitosamente, pero hubo ${resultado.totalErrores} errores. Revisa la consola para más detalles.`);
        console.log('Errores:', resultado.errores);
        
        // Verificar si hay errores de posición no encontrada
        const erroresPosicion = resultado.errores.filter(error => 
          error.error.includes('Posición de rack no encontrada') || 
          error.error.includes('Posición de pasillo no encontrada')
        );
        
        if (erroresPosicion.length > 0) {
          console.log('⚠️ Posibles soluciones:');
          console.log('1. Verificar que las posiciones estén generadas en la base de datos');
          console.log('2. Ejecutar POST /posiciones/generate para generar las posiciones');
          console.log('3. Verificar que los niveles sean A o B (mayúsculas)');
        }
      }
    } catch (error) {
      console.error('Error al enviar registros:', error);
      alert('Error al enviar los registros. Revisa la consola para más detalles.');
    } finally {
      setEnviando(false);
    }
  };

  const handleLimpiarTodo = () => {
    dispatch(limpiarRegistros());
  };

  // Función para crear nuevo item
  const handleCrearItem = async () => {
    if (!nuevoItem.descripcion.trim() || !nuevoItem.categoria) {
      setErrorItem('Por favor complete todos los campos');
      return;
    }

    if (!formData.proveedor) {
      setErrorItem('Debe seleccionar un proveedor primero');
      return;
    }

    setCreandoItem(true);
    setErrorItem('');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: nuevoItem.descripcion,
          categoria: nuevoItem.categoria,
          proveedor: formData.proveedor
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear el item');
      }

      const itemCreado = await response.json();
      
      // Recargar los datos de items y proveedores
      dispatch(cargarDatosIniciales());
      
      // Seleccionar automáticamente el item creado
      setFormData(prev => ({
        ...prev,
        item: itemCreado
      }));
      
      // Limpiar el formulario del modal
      setNuevoItem({ descripcion: '', categoria: '' });
      setOpenNuevoItem(false);
    } catch (error) {
      setErrorItem('Error al crear el item. Por favor intente nuevamente.');
      console.error(error);
    } finally {
      setCreandoItem(false);
    }
  };

  const handleCloseModalItem = () => {
    setNuevoItem({ descripcion: '', categoria: '' });
    setErrorItem('');
    setOpenNuevoItem(false);
  };

  // Handlers de navegación
  const handleLogoutClick = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/login';
  };

  // Renderizado condicional si no hay usuario
  if (!user) {
    return null;
  }

  return (
    <AppLayout user={user} onLogout={handleLogoutClick} pageTitle="Adición Rápida">
      <Box sx={{ 
        width: '100%', 
        maxWidth: '100%', 
        px: { xs: 1, sm: 2, md: 3 }, 
        py: 3,
        overflow: 'hidden',
        boxSizing: 'border-box',
        minHeight: '100vh'
      }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Adición Rápida
          </Typography>
          
          {/* Formulario de entrada */}
          <LoadingInfo loading={loading} error={error}>
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              width: '100%', 
              maxWidth: '100%', 
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}>
            <Typography variant="h6" gutterBottom>
              Nuevo Registro
            </Typography>
            
            {/* Mini cartel de error */}
            {validationError && (
              <Alert severity="error" sx={{ mb: 2, fontSize: '12px' }}>
                {validationError}
              </Alert>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              alignItems: 'flex-end',
              maxWidth: '100%',
              overflow: 'hidden'
            }}>
               <Box sx={{ flex: '1 1 200px', minWidth: '150px', maxWidth: '200px' }}>
                 <AutocompleteSelect
                   label="Proveedor"
                   value={formData.proveedor}
                   onChange={(value) => handleInputChange('proveedor', value)}
                   options={proveedores}
                   getOptionLabel={(option) => option.nombre || ''}
                   getOptionKey={(option) => `proveedor-${option.id || option.nombre}`}
                   filterOptions={filterProveedores}
                   loading={loading}
                 />
               </Box>
               
               <Box sx={{ flex: '1 1 250px', minWidth: '180px', maxWidth: '250px' }}>
                  <AutocompleteSelect
                    label="Item"
                    value={formData.item}
                    onChange={(value) => {
                      // Si se selecciona la opción de agregar nuevo item
                      if (value === 'add-new-item') {
                        setOpenNuevoItem(true);
                        return;
                      }
                      handleInputChange('item', value);
                    }}
                    options={itemsFiltrados}
                    getOptionLabel={(option) => `${option.categoria} - ${option.descripcion}` || ''}
                    getOptionKey={(option) => `item-${option.id || `${option.categoria}-${option.descripcion}`}`}
                    filterOptions={filterItems}
                    loading={loading}
                    disabled={!formData.proveedor}
                    noOptionsText={formData.proveedor && itemsFiltrados.length === 0 ? "No hay items para este proveedor" : "No hay opciones"}
                    extraOption={formData.proveedor ? (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          color: '#000000',
                          cursor: 'pointer',
                          px: 1,
                          py: 0.5,
                          '&:hover': {
                            backgroundColor: '#f0f0f0'
                          }
                        }}
                        onClick={() => setOpenNuevoItem(true)}
                      >
                        <span style={{ fontSize: '14px' }}>+</span>
                        <span style={{ fontSize: '12px' }}>Agregar nuevo item</span>
                      </Box>
                    ) : null}
                  />
                </Box>
              
              <Box sx={{ flex: '1 1 120px', minWidth: '80px', maxWidth: '120px' }}>
                <CompactInput
                  label="Partida"
                  value={formData.partida}
                  onChange={(e) => handleInputChange('partida', e.target.value)}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 100px', minWidth: '70px', maxWidth: '100px' }}>
                <CompactInput
                  label="Kilos"
                  type="number"
                  value={formData.kilos}
                  onChange={(e) => handleInputChange('kilos', e.target.value)}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 100px', minWidth: '70px', maxWidth: '100px' }}>
                <CompactInput
                  label="Unidades"
                  type="number"
                  value={formData.unidades}
                  onChange={(e) => handleInputChange('unidades', e.target.value)}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 80px', minWidth: '60px', maxWidth: '80px' }}>
                <CompactInput
                  label="Rack"
                  value={formData.rack}
                  onChange={(e) => handleInputChange('rack', e.target.value)}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 80px', minWidth: '60px', maxWidth: '80px' }}>
                <CompactInput
                  label="Fila"
                  value={formData.fila}
                  onChange={(e) => handleInputChange('fila', e.target.value)}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 100px', minWidth: '70px', maxWidth: '100px' }}>
                <CompactInput
                  label="Nivel (AB)"
                  value={formData.nivel}
                  onChange={(e) => handleInputChange('nivel', e.target.value)}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 100px', minWidth: '70px', maxWidth: '100px' }}>
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
                  sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    height: '28px',
                    width: '28px',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
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
             <Paper sx={{ p: 3, mb: 3, width: '100%', maxWidth: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Registros ({registros.length})
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={handleLimpiarTodo}
                >
                  Limpiar Todo
                </Button>
              </Box>
              
              <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ minWidth: 120, maxWidth: 150 }}>Proveedor</TableCell>
                      <TableCell sx={{ minWidth: 200, maxWidth: 250 }}>Item</TableCell>
                      <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>Partida</TableCell>
                      <TableCell sx={{ minWidth: 60, maxWidth: 80 }}>Kilos</TableCell>
                      <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>Unidades</TableCell>
                      <TableCell sx={{ minWidth: 50, maxWidth: 70 }}>Rack</TableCell>
                      <TableCell sx={{ minWidth: 50, maxWidth: 70 }}>Fila</TableCell>
                      <TableCell sx={{ minWidth: 60, maxWidth: 80 }}>Nivel</TableCell>
                      <TableCell sx={{ minWidth: 60, maxWidth: 80 }}>Pasillo</TableCell>
                      <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registros.map((registro, index) => (
                      <TableRow key={registro.id}>
                        <TableCell sx={{ minWidth: 120, maxWidth: 150, wordBreak: 'break-word' }}>
                          {registro.proveedor}
                        </TableCell>
                        <TableCell sx={{ minWidth: 200, maxWidth: 250, wordBreak: 'break-word' }}>
                          {registro.item}
                        </TableCell>
                        <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>
                          {registro.partida}
                        </TableCell>
                        <TableCell sx={{ minWidth: 60, maxWidth: 80 }}>
                          {registro.kilos}
                        </TableCell>
                        <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>
                          {registro.unidades}
                        </TableCell>
                        <TableCell sx={{ minWidth: 50, maxWidth: 70 }}>
                          {registro.rack}
                        </TableCell>
                        <TableCell sx={{ minWidth: 50, maxWidth: 70 }}>
                          {registro.fila}
                        </TableCell>
                        <TableCell sx={{ minWidth: 60, maxWidth: 80 }}>
                          {registro.nivel}
                        </TableCell>
                        <TableCell sx={{ minWidth: 60, maxWidth: 80 }}>
                          {registro.pasillo}
                        </TableCell>
                        <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>
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
                 {enviando ? 'Enviando...' : 'Enviar Registros'}
               </Button>
             </Box>
           )}
        </Box>

        {/* Modal para crear nuevo item */}
        <Dialog open={openNuevoItem} onClose={handleCloseModalItem} maxWidth="sm" fullWidth>
          <DialogTitle>Agregar Nuevo Item</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}>
              {errorItem && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorItem}
                </Alert>
              )}
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={nuevoItem.categoria}
                  label="Categoría"
                  onChange={(e) => setNuevoItem({...nuevoItem, categoria: e.target.value})}
                  disabled={creandoItem}
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
                    handleCrearItem();
                  }
                }}
                disabled={creandoItem}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModalItem} color="primary" disabled={creandoItem}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCrearItem} 
              color="primary"
              disabled={creandoItem || !nuevoItem.descripcion.trim() || !nuevoItem.categoria}
              variant="contained"
            >
              {creandoItem ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogActions>
        </Dialog>
    </AppLayout>
  );
};
