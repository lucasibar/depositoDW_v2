import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { PARTIDA_ESTADOS } from '../../constants/calidadConstants';
import styles from './PartidaCard.module.css';

const PartidaCard = ({ 
  partida, 
  onAprobar, 
  onRechazar, 
  onVolverCuarentena, 
  onAprobarStock,
  loading 
}) => {
  const isInCuarentena = partida.estado === PARTIDA_ESTADOS.CUARENTENA_UPPER || partida.estado === PARTIDA_ESTADOS.CUARENTENA;
  const isAprobada = partida.estado === PARTIDA_ESTADOS.APROBADO || partida.estado === PARTIDA_ESTADOS.APROBADA;

  const handleChipClick = () => {
    if (isInCuarentena) {
      onAprobar(partida.id);
    }
  };

  const renderChip = () => (
    <Chip 
      label={partida.estado} 
      color={isInCuarentena ? 'warning' : 'success'}
      icon={isInCuarentena ? <WarningIcon /> : <CheckCircleIcon />}
      onClick={handleChipClick}
      style={{ 
        cursor: isInCuarentena ? 'pointer' : 'default',
        transition: 'all 0.2s ease'
      }}
      disabled={loading}
    />
  );

  const renderPartidaInfo = () => (
    <>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Proveedor:</strong> {partida.proveedor}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Material:</strong> {partida.descripcionItem}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Cantidad:</strong> {partida.kilos} kg
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>Posición:</strong> {partida.posicion}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <strong>Fecha Entrada:</strong> {partida.fecha}
      </Typography>
    </>
  );

  const renderActionButtons = () => {
    if (!isAprobada) return null;

    return (
      <CardActions sx={{ justifyContent: 'space-around', py: 2 }}>
        <Tooltip title="Aprobar para stock">
          <IconButton 
            color="success" 
            onClick={() => onAprobarStock(partida.id)}
            disabled={loading}
            sx={{ 
              backgroundColor: '#4caf50',
              color: 'white',
              '&:hover': { backgroundColor: '#388e3c' },
              '&:disabled': { backgroundColor: '#ccc' }
            }}
          >
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rechazar partida">
          <IconButton 
            color="error" 
            onClick={() => onRechazar(partida.id)}
            disabled={loading}
            sx={{ 
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' },
              '&:disabled': { backgroundColor: '#ccc' }
            }}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Volver a cuarentena">
          <IconButton 
            color="warning" 
            onClick={() => onVolverCuarentena(partida.id)}
            disabled={loading}
            sx={{ 
              backgroundColor: '#ff9800',
              color: 'white',
              '&:hover': { backgroundColor: '#f57c00' },
              '&:disabled': { backgroundColor: '#ccc' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    );
  };

  return (
    <Card className={styles.partidaCard}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="div">
            Partida #{partida.numeroPartida || partida.id}
          </Typography>
          {renderChip()}
        </Box>
        {renderPartidaInfo()}
      </CardContent>
      {renderActionButtons()}
    </Card>
  );
};

export default PartidaCard; 