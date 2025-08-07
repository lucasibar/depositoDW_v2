import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  IconButton, 
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { PARTIDA_ESTADOS } from '../../constants/calidadConstants';
import ModernCard from '../../../../shared/ui/ModernCard/ModernCard';

const PartidaCard = ({ 
  partida, 
  onAprobar, 
  onRechazar, 
  onVolverCuarentena, 
  onAprobarStock,
  loading 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const isInCuarentena = partida.estado === PARTIDA_ESTADOS.CUARENTENA_UPPER || partida.estado === PARTIDA_ESTADOS.CUARENTENA;
  const isAprobada = partida.estado === PARTIDA_ESTADOS.APROBADO || partida.estado === PARTIDA_ESTADOS.APROBADA;

  const handleChipClick = () => {
    if (isInCuarentena) {
      onAprobar(partida.id);
    }
  };

  const getStatusColor = () => {
    if (isInCuarentena) return 'warning';
    if (isAprobada) return 'success';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isInCuarentena) return <WarningIcon />;
    if (isAprobada) return <CheckCircleIcon />;
    return null;
  };

  const renderMaterialInfo = () => {
    // Extraer categoría y descripción del item
    const categoria = partida.item?.categoria || 'Sin categoría';
    const descripcion = partida.item?.descripcion || partida.descripcionItem || 'Sin descripción';
    
    if (isMobile || isTablet) {
      // Layout de lista para móvil/tablet
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          minWidth: 0
        }}>
          {/* Primera línea: Categoría - Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              mb: 0.5,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {categoria} - {descripcion}
          </Typography>
          
          {/* Segunda línea: Proveedor, Partida, Fecha */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap'
            }}
          >
            <Box component="span" sx={{ color: 'var(--color-secondary)', fontWeight: 500 }}>
              {partida.proveedor}
            </Box>
            <Box component="span">•</Box>
            <Box component="span">
              <strong>Partida:</strong> #{partida.numeroPartida || partida.id}
            </Box>
            <Box component="span">•</Box>
            <Box component="span">
              <strong>Fecha:</strong> {partida.fecha}
            </Box>
          </Typography>
        </Box>
      );
    }
    
    // Layout original para desktop
    return (
      <Box sx={{ mb: 2 }}>
        {/* Título: Categoría + Descripción + Proveedor */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            mb: 0.5,
            lineHeight: 1.3
          }}
        >
          {categoria} - {descripcion}
          <Box 
            component="span" 
            sx={{ 
              color: 'var(--color-secondary)',
              fontWeight: 500,
              ml: 1
            }}
          >
            • {partida.proveedor}
          </Box>
        </Typography>
        
        {/* Subtítulo: Partida y Fecha en una línea */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box component="span">
            <strong>Partida:</strong> #{partida.numeroPartida || partida.id}
          </Box>
          <Box component="span">
            <strong>Fecha:</strong> {partida.fecha}
          </Box>
        </Typography>
      </Box>
    );
  };

  const renderDetails = () => {
    if (isMobile || isTablet) {
      // Layout de lista para móvil/tablet - diseño coherente para todos los estados
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          width: '100%'
        }}>
          {/* Botón de acción a la izquierda */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isInCuarentena && (
              <Tooltip title="Aprobar partida">
                <IconButton
                  onClick={handleChipClick}
                  disabled={loading}
                  size="medium"
                  sx={{ 
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-warning)',
                    color: 'var(--color-warning)',
                    '&:hover': {
                      backgroundColor: 'var(--color-warning)',
                      color: 'white'
                    },
                    '&:disabled': { 
                      backgroundColor: 'var(--color-divider)',
                      borderColor: 'var(--color-divider)'
                    },
                    transition: 'var(--transition-normal)',
                    width: 40,
                    height: 40
                  }}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          {/* Información del material en el centro */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {renderMaterialInfo()}
          </Box>
          
          {/* Botones de acción a la derecha para partidas aprobadas */}
          {isAprobada && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Aprobar para stock">
                <IconButton 
                  color="success" 
                  onClick={() => onAprobarStock(partida.id)}
                  disabled={loading}
                  size="small"
                  sx={{ 
                    backgroundColor: 'var(--color-success)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'var(--color-success-dark)',
                      transform: 'scale(1.1)'
                    },
                    '&:disabled': { backgroundColor: 'var(--color-divider)' },
                    transition: 'var(--transition-normal)',
                    width: 32,
                    height: 32
                  }}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rechazar partida">
                <IconButton 
                  color="error" 
                  onClick={() => onRechazar(partida.id)}
                  disabled={loading}
                  size="small"
                  sx={{ 
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'var(--color-error-dark)',
                      transform: 'scale(1.1)'
                    },
                    '&:disabled': { backgroundColor: 'var(--color-divider)' },
                    transition: 'var(--transition-normal)',
                    width: 32,
                    height: 32
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Volver a cuarentena">
                <IconButton 
                  color="warning" 
                  onClick={() => onVolverCuarentena(partida.id)}
                  disabled={loading}
                  size="small"
                  sx={{ 
                    backgroundColor: 'var(--color-warning)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'var(--color-warning-dark)',
                      transform: 'scale(1.1)'
                    },
                    '&:disabled': { backgroundColor: 'var(--color-divider)' },
                    transition: 'var(--transition-normal)',
                    width: 32,
                    height: 32
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      );
    }
    
    // Layout original para desktop - solo estado, sin información del material
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start', 
        alignItems: 'center',
        mb: 2
      }}>
        {/* Estado discreto sin texto */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isInCuarentena && (
            <Tooltip title="Aprobar partida">
              <IconButton
                onClick={handleChipClick}
                disabled={loading}
                size="small"
                sx={{ 
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-warning)',
                  color: 'var(--color-warning)',
                  '&:hover': {
                    backgroundColor: 'var(--color-warning)',
                    color: 'white'
                  },
                  '&:disabled': { 
                    backgroundColor: 'var(--color-divider)',
                    borderColor: 'var(--color-divider)'
                  },
                  transition: 'var(--transition-normal)',
                  width: 32,
                  height: 32
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {isAprobada && (
            <Chip 
              label={partida.estado} 
              color="success"
              icon={<CheckCircleIcon />}
              size="small"
              sx={{ 
                backgroundColor: 'var(--color-success)',
                color: 'white'
              }}
            />
          )}
        </Box>
      </Box>
    );
  };

  const renderActionButtons = () => {
    // No mostrar botones de acción en la parte inferior para móvil/tablet
    if (isMobile || isTablet) return null;
    
    // Solo mostrar botones de acción para partidas aprobadas en desktop
    if (!isAprobada) return null;

    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        gap: 1,
        mt: 2,
        pt: 2,
        borderTop: '1px solid var(--color-divider)'
      }}>
        <Tooltip title="Aprobar para stock">
          <IconButton 
            color="success" 
            onClick={() => onAprobarStock(partida.id)}
            disabled={loading}
            size="small"
            sx={{ 
              backgroundColor: 'var(--color-success)',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'var(--color-success-dark)',
                transform: 'scale(1.1)'
              },
              '&:disabled': { backgroundColor: 'var(--color-divider)' },
              transition: 'var(--transition-normal)'
            }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rechazar partida">
          <IconButton 
            color="error" 
            onClick={() => onRechazar(partida.id)}
            disabled={loading}
            size="small"
            sx={{ 
              backgroundColor: 'var(--color-error)',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'var(--color-error-dark)',
                transform: 'scale(1.1)'
              },
              '&:disabled': { backgroundColor: 'var(--color-divider)' },
              transition: 'var(--transition-normal)'
            }}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Volver a cuarentena">
          <IconButton 
            color="warning" 
            onClick={() => onVolverCuarentena(partida.id)}
            disabled={loading}
            size="small"
            sx={{ 
              backgroundColor: 'var(--color-warning)',
              color: 'white',
              '&:hover': { 
                backgroundColor: 'var(--color-warning-dark)',
                transform: 'scale(1.1)'
              },
              '&:disabled': { backgroundColor: 'var(--color-divider)' },
              transition: 'var(--transition-normal)'
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  return (
    <ModernCard
      padding={isMobile || isTablet ? "compact" : "normal"}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'var(--transition-normal)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-lg)'
        },
        // Para móvil/tablet: diseño de lista sin estilos problemáticos
        ...(isMobile || isTablet ? {
          borderBottom: '1px solid var(--color-divider)', // Solo separador
          '&:hover': {
            transform: 'none',
            boxShadow: 'none'
          },
          '&:last-child': {
            borderBottom: 'none' // Sin borde en el último item
          }
        } : {
          width: '100%',
          maxWidth: '100%'
        })
      }}
    >
      {(isMobile || isTablet) ? (
        // Layout de lista para móvil/tablet
        <>
          {renderDetails()}
          {renderActionButtons()}
        </>
      ) : (
        // Layout original para desktop
        <>
          {renderMaterialInfo()}
          {renderDetails()}
          {renderActionButtons()}
        </>
      )}
    </ModernCard>
  );
};

export default PartidaCard; 