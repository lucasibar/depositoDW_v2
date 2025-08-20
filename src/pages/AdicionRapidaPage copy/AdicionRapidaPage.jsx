import React, { useState } from 'react';
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
  TableRow
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { agregarRegistro, limpiarRegistros, eliminarRegistro } from '../../features/adicionesRapidas/model/slice';
import { selectAdicionesRapidas } from '../../features/adicionesRapidas/model/selectors';
import AppLayout from '../../shared/ui/AppLayout/AppLayout';

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
  const registros = useSelector(selectAdicionesRapidas);
  
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar al backend
    console.log('Registros a enviar:', registros);
    alert('Función de envío al backend no implementada aún');
  };

  const handleLimpiarTodo = () => {
    dispatch(limpiarRegistros());
  };

  return (
    <AppLayout>
             <Container maxWidth={false} sx={{ width: '100%', px: 2 }}>
                 <Box sx={{ py: 3, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Adición Rápida
          </Typography>
          
          {/* Formulario de entrada */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nuevo Registro
            </Typography>
            
                                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Proveedor"
                   value={formData.proveedor}
                   onChange={(e) => handleInputChange('proveedor', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Item"
                   value={formData.item}
                   onChange={(e) => handleInputChange('item', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Partida"
                   value={formData.partida}
                   onChange={(e) => handleInputChange('partida', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Kilos"
                   type="number"
                   value={formData.kilos}
                   onChange={(e) => handleInputChange('kilos', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Unidades"
                   type="number"
                   value={formData.unidades}
                   onChange={(e) => handleInputChange('unidades', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Rack"
                   value={formData.rack}
                   onChange={(e) => handleInputChange('rack', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Fila"
                   value={formData.fila}
                   onChange={(e) => handleInputChange('fila', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Nivel (AB)"
                   value={formData.nivel}
                   onChange={(e) => handleInputChange('nivel', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flex: 1 }}>
                 <CompactInput
                   label="Pasillo"
                   value={formData.pasillo}
                   onChange={(e) => handleInputChange('pasillo', e.target.value)}
                 />
               </Box>
               
               <Box sx={{ flexShrink: 0 }}>
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

          {/* Tabla de registros */}
          {registros.length > 0 && (
            <Paper sx={{ p: 3, mb: 3, width: '100%' }}>
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
                sx={{ minWidth: 200 }}
              >
                Enviar Registros
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </AppLayout>
  );
};
