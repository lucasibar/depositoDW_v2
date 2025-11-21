import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Scale as ScaleIcon,
  Numbers as NumbersIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const PosicionesEntradaTab = ({ posicionesEntrada, onRefresh }) => {
  const [expandedPositions, setExpandedPositions] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (positionId) => {
    const newExpanded = new Set(expandedPositions);
    if (newExpanded.has(positionId)) {
      newExpanded.delete(positionId);
    } else {
      newExpanded.add(positionId);
    }
    setExpandedPositions(newExpanded);
  };

  const filteredPositions = posicionesEntrada?.filter(position => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return position.items.some(item => 
      item.item.descripcion.toLowerCase().includes(searchLower) ||
      item.item.categoria.toLowerCase().includes(searchLower) ||
      item.proveedor?.nombre?.toLowerCase().includes(searchLower) ||
      item.partida.numeroPartida.toString().includes(searchLower)
    );
  }) || [];

  const getTotalItems = () => {
    return posicionesEntrada?.reduce((total, position) => total + position.items.length, 0) || 0;
  };

  const getTotalKilos = () => {
    return posicionesEntrada?.reduce((total, position) => 
      total + position.items.reduce((posTotal, item) => posTotal + item.kilos, 0), 0
    ) || 0;
  };

  const getTotalUnidades = () => {
    return posicionesEntrada?.reduce((total, position) => 
      total + position.items.reduce((posTotal, item) => posTotal + item.unidades, 0), 0
    ) || 0;
  };

  if (!posicionesEntrada || posicionesEntrada.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        No hay posiciones de entrada configuradas o no contienen items.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Resumen */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {posicionesEntrada.length}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Posiciones de Entrada
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getTotalItems()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Items Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-warning)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScaleIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getTotalKilos().toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Kilos Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'var(--color-info)', color: 'white' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NumbersIcon />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getTotalUnidades()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Unidades Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barra de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por descripción, categoría, proveedor o partida..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600 }}
        />
      </Box>

      {/* Lista de posiciones */}
      {filteredPositions.map((position) => (
        <Card key={position.id} sx={{ mb: 2, boxShadow: 'var(--shadow-sm)' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Posición de Entrada
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${position.items.length} items`} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`${position.items.reduce((total, item) => total + item.kilos, 0).toFixed(2)} kg`} 
                    size="small" 
                    color="secondary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`${position.items.reduce((total, item) => total + item.unidades, 0)} unidades`} 
                    size="small" 
                    color="info" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
              
              <Tooltip title={expandedPositions.has(position.id) ? "Contraer" : "Expandir"}>
                <IconButton 
                  onClick={() => toggleExpanded(position.id)}
                  sx={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'white',
                    '&:hover': { backgroundColor: 'var(--color-primary-dark)' }
                  }}
                >
                  {expandedPositions.has(position.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Collapse in={expandedPositions.has(position.id)}>
              <Box sx={{ mt: 2 }}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'var(--color-background)' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Categoría</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Proveedor</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Partida</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Kilos</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Unidades</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {position.items.map((item, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {item.item.descripcion}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {item.item.id}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={item.item.categoria} 
                              size="small" 
                              color="primary" 
                              variant="outlined" 
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {item.proveedor?.nombre || 'Sin proveedor'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.partida.numeroPartida}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.kilos.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.unidades}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {filteredPositions.length === 0 && searchTerm && (
        <Alert severity="info">
          No se encontraron items que coincidan con la búsqueda "{searchTerm}".
        </Alert>
      )}
    </Box>
  );
};

export default PosicionesEntradaTab;
