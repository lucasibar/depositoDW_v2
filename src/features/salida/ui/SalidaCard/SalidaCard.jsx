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
  SALIDA_ESTADOS_COLORS,
  REMITO_ESTADOS_LABELS,
  REMITO_ESTADOS_COLORS
} from '../../constants/salidaConstants';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const SalidaCard = ({ 
  salida, 
  onAprobar, 
  onRechazar, 
  onCompletar, 
  loading = false 
}) => {
  // Determinar si es un remito del historial o una salida
  const isRemito = salida.numeroRemito && salida.proveedor;

  if (isRemito) {
    // Renderizar como remito del historial
    const {
      numeroRemito,
      fecha,
      proveedor,
      items = []
    } = salida;

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Remito #{numeroRemito}
            </Typography>
            <Chip 
              label="Entregado" 
              color="success"
              size="small"
            />
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ScheduleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Fecha: {new Date(fecha).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalShippingIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Proveedor: {proveedor}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ExitToAppIcon fontSize="small" color="action" />
                <Typography variant="body2" color="textSecondary">
                  Materiales: {items.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {items.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Materiales:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {items.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${item.kilos || 0}kg / ${item.unidades || 0}un - ${item.descripcion}`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
  } else {
    // Renderizar como salida normal (mantener lógica anterior)
    const {
      id,
      numero,
      numeroSalida,
      solicitante,
      destino,
      fechaSolicitud,
      fechaAprobacion,
      fechaEmision,
      fechaEntrega,
      estado,
      materiales = [],
      motivo,
      observaciones,
      transportista,
      vehiculo,
      patente
    } = salida;

    // Determinar si es un remito basado en la presencia de campos específicos
    const isRemitoSalida = numeroSalida || transportista || vehiculo || patente;

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
      if (isRemitoSalida) {
        // Botones específicos para remitos
        if (estado === 'en_transito') {
          return (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleCompletar}
                disabled={loading}
              >
                Marcar como Entregado
              </Button>
            </Box>
          );
        }
        return null; // No mostrar botones para remitos entregados
      } else {
        // Botones específicos para salidas
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
      }

      return null;
    };

    const getEstadoLabel = () => {
      if (isRemitoSalida) {
        return REMITO_ESTADOS_LABELS[estado] || estado;
      }
      return SALIDA_ESTADOS_LABELS[estado] || estado;
    };

    const getEstadoColor = () => {
      if (isRemitoSalida) {
        return REMITO_ESTADOS_COLORS[estado] || 'default';
      }
      return SALIDA_ESTADOS_COLORS[estado] || 'default';
    };

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {isRemitoSalida ? `Remito ${numero}` : `Salida ${numero}`}
            </Typography>
            <Chip 
              label={getEstadoLabel()} 
              color={getEstadoColor()}
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
                  Fecha: {new Date(fechaSolicitud || fechaEmision).toLocaleDateString()}
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

          {/* Información específica de remitos */}
          {isRemitoSalida && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom>
                Información de Transporte:
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {numeroSalida && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ExitToAppIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary">
                        Salida: {numeroSalida}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {transportista && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalShippingIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary">
                        Transportista: {transportista}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {vehiculo && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <DirectionsCarIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary">
                        Vehículo: {vehiculo}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {patente && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <DirectionsCarIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="textSecondary">
                        Patente: {patente}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </>
          )}

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
  }
};

export default SalidaCard; 