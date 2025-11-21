import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  Scale as ScaleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

const MaterialCard = ({ material, onGenerarRemito, loading = false }) => {
  const {
    id,
    codigo,
    descripcion,
    posicion,
    stock,
    unidad,
    categoria,
    proveedor,
    fechaIngreso,
    estado = 'disponible'
  } = material;

  const getEstadoColor = () => {
    switch (estado) {
      case 'disponible':
        return 'success';
      case 'bajo_stock':
        return 'warning';
      case 'sin_stock':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEstadoLabel = () => {
    switch (estado) {
      case 'disponible':
        return 'Disponible';
      case 'bajo_stock':
        return 'Bajo Stock';
      case 'sin_stock':
        return 'Sin Stock';
      default:
        return estado;
    }
  };

  const handleGenerarRemito = () => {
    if (onGenerarRemito) {
      onGenerarRemito(material);
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header con código y estado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {codigo}
          </Typography>
          <Chip 
            label={getEstadoLabel()} 
            color={getEstadoColor()}
            size="small"
          />
        </Box>

        {/* Descripción */}
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
          {descripcion}
        </Typography>

        {/* Información del material */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Posición: {posicion}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ScaleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Stock: {stock} {unidad}
              </Typography>
            </Box>
          </Grid>

          {categoria && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CategoryIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Categoría: {categoria}
                </Typography>
              </Box>
            </Grid>
          )}

          {proveedor && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InventoryIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Proveedor: {proveedor}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {fechaIngreso && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Ingreso: {new Date(fechaIngreso).toLocaleDateString()}
            </Typography>
          </>
        )}

        {/* Botón de acción */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerarRemito}
            disabled={loading || estado === 'sin_stock'}
            startIcon={<InventoryIcon />}
          >
            {loading ? 'Procesando...' : 'Generar Remito'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MaterialCard; 