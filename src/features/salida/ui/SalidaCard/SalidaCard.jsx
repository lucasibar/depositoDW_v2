import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Button,
  Grid,
  Divider
} from '@mui/material';
import { 
  SALIDA_ESTADOS_LABELS, 
  SALIDA_ESTADOS_COLORS 
} from '../../constants/salidaConstants';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';

const SalidaCard = ({ 
  salida, 
  onAprobar, 
  onRechazar, 
  onCompletar, 
  loading = false 
}) => {
  const {
    id,
    numero,
    solicitante,
    destino,
    fechaSolicitud,
    fechaAprobacion,
    estado,
    materiales = [],
    motivo,
    observaciones
  } = salida;

  const handleAprobar = () => {
    if (onAprobar) {
      onAprobar(id);
    }
  };

  const handleRechazar = () => {
    if (onRechazar) {
      onRechazar(id, motivo);
    }
  };

  const handleCompletar = () => {
    if (onCompletar) {
      onCompletar(id);
    }
  };

  const renderActionButtons = () => {
    if (estado === 'pendiente') {
      return (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handleAprobar}
            disabled={loading}
          >
            Aprobar
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleRechazar}
            disabled={loading}
          >
            Rechazar
          </Button>
        </Box>
      );
    }

    if (estado === 'aprobada') {
      return (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleCompletar}
            disabled={loading}
          >
            Completar
          </Button>
        </Box>
      );
    }

    return null;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Salida #{numero}
          </Typography>
          <Chip 
            label={SALIDA_ESTADOS_LABELS[estado]} 
            color={SALIDA_ESTADOS_COLORS[estado]}
            size="small"
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Solicitante: {solicitante}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Destino: {destino}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Fecha: {new Date(fechaSolicitud).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ExitToAppIcon fontSize="small" color="action" />
              <Typography variant="body2" color="textSecondary">
                Materiales: {materiales.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {materiales.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Materiales:
            </Typography>
            <Box sx={{ mb: 2 }}>
              {materiales.map((material, index) => (
                <Chip
                  key={index}
                  label={`${material.cantidad} ${material.unidad} - ${material.descripcion}`}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </>
        )}

        {motivo && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Motivo:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {motivo}
            </Typography>
          </>
        )}

        {observaciones && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" gutterBottom>
              Observaciones:
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {observaciones}
            </Typography>
          </>
        )}

        {renderActionButtons()}
      </CardContent>
    </Card>
  );
};

export default SalidaCard; 