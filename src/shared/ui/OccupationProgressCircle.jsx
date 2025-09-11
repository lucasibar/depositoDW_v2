import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const ProgressContainer = styled(Box)({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '20px 0',
});

const ProgressText = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
});

const OccupationProgressCircle = ({ estadisticas, loading, error }) => {
  if (loading) {
    return (
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Cargando ocupación...
        </Typography>
        <CircularProgress />
      </StyledPaper>
    );
  }

  if (error) {
    return (
      <StyledPaper>
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar datos
        </Typography>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </StyledPaper>
    );
  }

  if (!estadisticas) {
    return (
      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Sin datos disponibles
        </Typography>
      </StyledPaper>
    );
  }

  const { porcentajeOcupacion, totalPosiciones, posicionesOcupadas } = estadisticas;
  
  // Determinar el color basado en el porcentaje
  let color = '#f44336'; // Rojo por defecto
  if (porcentajeOcupacion >= 75) {
    color = '#4caf50'; // Verde
  } else if (porcentajeOcupacion >= 60) {
    color = '#ff9800'; // Naranja
  }

  return (
    <StyledPaper>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#2c3e50' }}>
        Ocupación del Depósito
      </Typography>
      
      <ProgressContainer>
        <CircularProgress
          variant="determinate"
          value={porcentajeOcupacion}
          size={200}
          thickness={8}
          sx={{
            color: color,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <ProgressText>
          <Typography variant="h3" sx={{ fontWeight: 700, color: color }}>
            {Math.round(porcentajeOcupacion)}%
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
            Ocupado
          </Typography>
        </ProgressText>
      </ProgressContainer>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1 }}>
          {posicionesOcupadas} de {totalPosiciones} posiciones
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {totalPosiciones - posicionesOcupadas} posiciones vacías
        </Typography>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: '50%' }} />
          <Typography variant="body2">≥75% (Óptimo)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: '50%' }} />
          <Typography variant="body2">60-74% (Regular)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#f44336', borderRadius: '50%' }} />
          <Typography variant="body2">&lt;60% (Bajo)</Typography>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default OccupationProgressCircle;
