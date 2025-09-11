import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LocalShipping, 
  Scale, 
  TrendingUp,
  CalendarToday,
  Refresh
} from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const MovimientosInternosPesadosCard = ({ estadisticas, loading, error, onRefresh }) => {
  if (loading) {
    return (
      <StyledCard>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Cargando movimientos...
          </Typography>
          <CircularProgress sx={{ color: 'white' }} />
        </CardContent>
      </StyledCard>
    );
  }

  if (error) {
    return (
      <StyledCard>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Error al cargar datos
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
          {onRefresh && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Refresh 
                onClick={onRefresh} 
                sx={{ cursor: 'pointer', fontSize: 32 }}
              />
            </Box>
          )}
        </CardContent>
      </StyledCard>
    );
  }

  if (!estadisticas) {
    return (
      <StyledCard>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Sin datos disponibles
          </Typography>
        </CardContent>
      </StyledCard>
    );
  }

  const { totalMovimientos, totalKilos, promedioKilos, periodo } = estadisticas;

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocalShipping sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Movimientos Internos Pesados
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Último mes (&gt;200 kg por movimiento)
            </Typography>
          </Box>
        </Box>

        {/* Estadísticas principales */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {totalMovimientos}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Movimientos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {totalKilos?.toFixed(0) || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Kg Totales
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        {/* Estadísticas adicionales */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Scale sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Promedio por movimiento: <strong>{promedioKilos?.toFixed(1) || 0} kg</strong>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Período: {periodo?.desde} a {periodo?.hasta}
            </Typography>
          </Box>
        </Box>

        {/* Chip de estado */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Chip
            label={totalMovimientos > 0 ? "Actividad Alta" : "Sin Actividad"}
            color={totalMovimientos > 0 ? "success" : "default"}
            sx={{ 
              backgroundColor: totalMovimientos > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default MovimientosInternosPesadosCard;
