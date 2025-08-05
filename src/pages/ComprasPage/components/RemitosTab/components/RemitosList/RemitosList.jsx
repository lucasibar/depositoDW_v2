import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRemitosAgrupados } from '../../../../../../features/remitos/hooks/useRemitosAgrupados';

export const RemitosList = () => {
  const { remitos, isLoading, error, handleRetry, handleDeleteMovimiento } = useRemitosAgrupados();
  const [expandedRemito, setExpandedRemito] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });

  const remitosList = remitos;

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

  if (remitosList.length === 0) {
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
      <Box>
        {remitosList.map((remito, index) => {
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
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                    Detalle del Remito:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {remito.partidas.map((partida, partidaIndex) => (
                      <Grid item xs={12} key={partidaIndex}>
                        <Box 
                          sx={{ 
                            p: 2, 
                            border: '1px solid #e0e0e0', 
                            borderRadius: 1,
                            backgroundColor: '#f8f9fa',
                            mb: 2
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                            Partida: {partida.numeroPartida}
                          </Typography>
                          <Grid container spacing={2}>
                            {partida.items.map((item, itemIndex) => (
                              <Grid item xs={12} sm={6} md={4} key={itemIndex}>
                                <Box 
                                  sx={{ 
                                    p: 2, 
                                    border: '1px solid #e0e0e0', 
                                    borderRadius: 1,
                                    backgroundColor: '#ffffff',
                                    position: 'relative'
                                  }}
                                >
                                 {partida.estado !== 'stock' && (
                                   <IconButton
                                     size="small"
                                     color="error"
                                     onClick={() => handleDeleteItem(item)}
                                     sx={{
                                       position: 'absolute',
                                       top: 4,
                                       right: 4,
                                     }}
                                   >
                                     <DeleteIcon fontSize="small" />
                                   </IconButton>
                                 )}
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {item.descripcion}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    Categoría: {item.categoria}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Chip 
                                      label={`${item.kilos} kg`} 
                                      size="small" 
                                      color="secondary"
                                    />
                                    <Chip 
                                      label={`${item.unidades} uds`} 
                                      size="small" 
                                      color="info"
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
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