import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Scale as ScaleIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import styles from './MaterialDetailModal.module.css';

export const MaterialDetailModal = ({ 
  open, 
  onClose, 
  material,
  onNavigateToMateriales 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!material) return null;

  const handleNavigateToMateriales = () => {
    if (onNavigateToMateriales) {
      onNavigateToMateriales(material);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 'var(--border-radius-lg)',
          maxHeight: isMobile ? '100%' : '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <InventoryIcon />
        Detalles del Material
      </DialogTitle>

      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
        {material.item && (
          <>
            {/* Información del Item */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'var(--color-text-primary)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <CategoryIcon color="primary" />
                Información del Item
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Categoría
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {material.item.categoria || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {material.item.descripcion || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Información de Stock */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'var(--color-text-primary)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <ScaleIcon color="primary" />
                Stock Disponible
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Kilos
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: 'var(--color-primary)'
                    }}>
                      {material.kilos?.toFixed(2) || 0} kg
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Unidades
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: 'var(--color-primary)'
                    }}>
                      {material.unidades || 0} un
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Información de Partida y Proveedor */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'var(--color-text-primary)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <AssignmentIcon color="primary" />
                Información de Origen
              </Typography>
              
              <Grid container spacing={2}>
                {material.partida?.numeroPartida && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Número de Partida
                      </Typography>
                      <Chip 
                        label={material.partida.numeroPartida}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Grid>
                )}
                
                {material.proveedor && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Proveedor
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {material.proveedor}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </>
        )}

        {/* Información adicional si está disponible */}
        {material.posicion && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'var(--color-text-primary)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <InventoryIcon color="primary" />
                Ubicación
              </Typography>
              
              <Typography variant="body1">
                {material.posicion.rack && material.posicion.fila && material.posicion.AB 
                  ? `Rack: ${material.posicion.rack} - Fila: ${material.posicion.fila} - Nivel: ${material.posicion.AB}`
                  : material.posicion.numeroPasillo 
                    ? `Pasillo: ${material.posicion.numeroPasillo}`
                    : 'Ubicación no especificada'
                }
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: isMobile ? 2 : 3,
        gap: 1,
        flexWrap: 'wrap'
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)'
          }}
        >
          Cerrar
        </Button>
        
        {onNavigateToMateriales && (
          <Button
            onClick={handleNavigateToMateriales}
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            sx={{ 
              backgroundColor: 'var(--color-primary)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-dark)'
              }
            }}
          >
            Ver en Materiales
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
