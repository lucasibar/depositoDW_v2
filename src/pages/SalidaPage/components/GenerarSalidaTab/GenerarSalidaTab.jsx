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
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { agregarRegistro, limpiarRegistros, eliminarRegistro } from '../../../../features/adicionesRapidas/model/slice';
import { 
  selectAdicionesRapidas, 
  selectProveedores, 
  selectItems, 
  selectAdicionesRapidasLoading, 
  selectAdicionesRapidasError 
} from '../../../../features/adicionesRapidas/model/selectors';
import { cargarDatosIniciales } from '../../../../features/adicionesRapidas/model/thunks';
import { useAdicionRapida } from '../../../../features/adicionesRapidas/hooks/useAdicionRapida';
import AutocompleteSelect from '../../../../shared/ui/AutocompleteSelect';
import LoadingInfo from '../../../../shared/ui/LoadingInfo';

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

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Si cambia el proveedor, limpiar el item
      if (field === 'proveedor') {
        newData.item = '';
      }
      
      return newData;
    });
  };

  const handleAgregarRegistro = () => {
    const nuevoRegistro = {
      id: Date.now(),
      ...formData
    };
    
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
  };

  const handleEliminarRegistro = (index) => {
    dispatch(eliminarRegistro(index));
  };

  const handleSubmit = async () => {
    if (enviando) return;
    
    setEnviando(true);
    try {
      // Aquí iría la lógica para enviar las salidas
      // Por ahora solo simulamos el envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`¡Éxito! Se procesaron ${registros.length} registros de salida correctamente.`);
      // Limpiar los registros después del envío exitoso
      dispatch(limpiarRegistros());
    } catch (error) {
      console.error('Error al enviar registros de salida:', error);
      alert('Error al enviar los registros de salida. Revisa la consola para más detalles.');
    } finally {
      setEnviando(false);
    }
  };

  const handleLimpiarTodo = () => {
    dispatch(limpiarRegistros());
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
            <Box sx={{ flex: '1 1 200px', minWidth: '180px' }}>
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
                noOptionsText={formData.proveedor && itemsFiltrados.length === 0 ? "No hay items para este proveedor" : "No hay opciones"}
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
                    <TableCell>{registro.proveedor}</TableCell>
                    <TableCell>{registro.item}</TableCell>
                    <TableCell>{registro.partida}</TableCell>
                    <TableCell>{registro.kilos}</TableCell>
                    <TableCell>{registro.unidades}</TableCell>
                    <TableCell>{registro.rack}</TableCell>
                    <TableCell>{registro.fila}</TableCell>
                    <TableCell>{registro.nivel}</TableCell>
                    <TableCell>{registro.pasillo}</TableCell>
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
    </Box>
  );
};
