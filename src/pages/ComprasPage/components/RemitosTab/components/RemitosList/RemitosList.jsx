import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRemitosAgrupados } from '../../../../../../features/remitos/hooks/useRemitosAgrupados';
import { SearchBar } from '../../../../../../shared/ui/SearchBar/SearchBar';

export const RemitosList = () => {
  const { remitos, isLoading, error, handleRetry, handleDeleteMovimiento } = useRemitosAgrupados();
  const [expandedRemito, setExpandedRemito] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [searchTerm, setSearchTerm] = useState('');

  // Función para filtrar remitos basada en el término de búsqueda
  const filteredRemitos = useMemo(() => {
    if (!searchTerm.trim()) {
      return remitos;
    }

    const searchLower = searchTerm.toLowerCase();
    
    return remitos.filter(remito => {
      // Buscar en el nombre del proveedor
      if (remito.proveedor?.nombre?.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Buscar en las partidas e items
      return remito.partidas.some(partida => {
        // Buscar en el número de partida
        if (partida.numeroPartida?.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Buscar en los items de la partida
        return partida.items.some(item => {
          return (
            item.descripcion?.toLowerCase().includes(searchLower) ||
            item.categoria?.toLowerCase().includes(searchLower)
          );
        });
      });
    });
  }, [remitos, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={handleRetry}>
        {error}
      </Alert>
    );
  }

  if (remitos.length === 0) {
    return (
      <Typography color="textSecondary" textAlign="center" p={3}>
        No hay remitos de entrada cargados. Crea uno nuevo para comenzar.
      </Typography>
    );
  }

  const handleAccordionChange = (remitoKey) => (event, isExpanded) => {
    setExpandedRemito(isExpanded ? remitoKey : null);
  };

  const handleDeleteItem = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const confirmDelete = async () => {
    if (deleteDialog.item) {
      const result = await handleDeleteMovimiento(deleteDialog.item.movimientoId);
      if (result.success) {
        setDeleteDialog({ open: false, item: null });
      } else {
        console.error('Error al eliminar:', result.error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, item: null });
  };

  return (
    <>
      {/* SearchBar */}
      <Box sx={{ mb: 3 }}>
        <SearchBar 
          placeholder="Buscar por proveedor, partida, descripción o categoría..."
          onSearch={handleSearch}
          debounceMs={300}
        />
      </Box>

      {/* Información de resultados */}
      {searchTerm && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {filteredRemitos.length === 0 
              ? `No se encontraron remitos que coincidan con "${searchTerm}"`
              : `Se encontraron ${filteredRemitos.length} remito${filteredRemitos.length !== 1 ? 's' : ''} que coinciden con "${searchTerm}"`
            }
          </Typography>
        </Box>
      )}

      <Box>
        {filteredRemitos.map((remito, index) => {
          const remitoKey = `remito-${index}`;
          const totalKilos = remito.partidas.reduce((sum, partida) => 
            sum + partida.items.reduce((partidaSum, item) => partidaSum + item.kilos, 0), 0
          );
          const totalUnidades = remito.partidas.reduce((sum, partida) => 
            sum + partida.items.reduce((partidaSum, item) => partidaSum + item.unidades, 0), 0
          );
          const totalItems = remito.partidas.reduce((sum, partida) => sum + partida.items.length, 0);
        
          return (
            <Accordion 
              key={remitoKey}
              expanded={expandedRemito === remitoKey}
              onChange={handleAccordionChange(remitoKey)}
              sx={{ 
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Remito #{remito.numeroRemito}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {remito.proveedor.nombre} • {remito.fecha ? new Date(remito.fecha).toLocaleDateString() : 'Sin fecha'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={`${totalItems} items`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`${totalKilos.toFixed(2)} kg`} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={`${totalUnidades} uds`} 
                      size="small" 
                      color="info" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Partida</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Descripción</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Categoría</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }} align="right">Kilos</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }} align="right">Unidades</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {remito.partidas.map((partida, partidaIndex) => 
                        partida.items.map((item, itemIndex) => (
                          <TableRow 
                            key={`${partidaIndex}-${itemIndex}`}
                            sx={{ 
                              '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                              '&:hover': { backgroundColor: '#f0f0f0' }
                            }}
                          >
                            <TableCell sx={{ fontSize: '0.875rem' }}>
                              {partida.numeroPartida}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                              {item.descripcion}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.875rem' }}>
                              {item.categoria}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                              {item.kilos} kg
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                              {item.unidades} uds
                            </TableCell>
                            <TableCell align="center">
                              {partida.estado !== 'stock' && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteItem(item)}
                                  sx={{ padding: '4px' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialog.open} onClose={cancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar el item "{deleteDialog.item?.descripcion}"?
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 