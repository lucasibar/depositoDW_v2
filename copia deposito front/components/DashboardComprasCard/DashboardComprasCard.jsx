import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
  Scale as ScaleIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon
} from '@mui/icons-material';
import styles from './DashboardComprasCard.module.css';

export const DashboardComprasCard = ({ 
  tarjeta, 
  onClick, 
  onConfigClick,
  isLoading = false 
}) => {
  const getColorByCategoria = (categoria) => {
    switch (categoria) {
      case 'algodon':
        return '#4CAF50'; // Verde
      case 'nylon':
        return '#2196F3'; // Azul
      case 'goma':
        return '#FF9800'; // Naranja
      case 'lycra':
        return '#9C27B0'; // Púrpura
      default:
        return '#757575'; // Gris
    }
  };

  const getIconByCategoria = (categoria) => {
    switch (categoria) {
      case 'algodon':
        return '🧵';
      case 'nylon':
        return '🧶';
      case 'goma':
        return '🔗';
      case 'lycra':
        return '🎽';
      default:
        return '📦';
    }
  };

  const color = getColorByCategoria(tarjeta.categoria);
  const icon = getIconByCategoria(tarjeta.categoria);

  return (
    <Card 
      className={styles.card}
      sx={{
        background: 'white',
        border: `2px solid ${color}20`,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}30`,
          borderColor: `${color}40`
        }
      }}
      onClick={() => onClick?.(tarjeta)}
    >
      {/* Indicador de color en la parte superior */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: color,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}
      />

      <CardContent sx={{ p: 3, pb: 2 }}>
        {/* Header con icono y botón de configuración */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: '2rem',
                lineHeight: 1
              }}
            >
              {icon}
            </Typography>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#2c3e50',
                  fontSize: '1.1rem',
                  lineHeight: 1.2
                }}
              >
                {tarjeta.nombreTarjeta}
              </Typography>
              <Chip
                label={tarjeta.categoria.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: `${color}20`,
                  color: color,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 20,
                  mt: 0.5
                }}
              />
            </Box>
          </Box>

          <Tooltip title="Configurar items">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onConfigClick?.(tarjeta);
              }}
              sx={{
                color: color,
                backgroundColor: `${color}10`,
                '&:hover': {
                  backgroundColor: `${color}20`
                }
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Contenido de stock */}
        <Box sx={{ mt: 2 }}>
          {isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1,
              opacity: 0.7
            }}>
              <Box sx={{ 
                height: 20, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 1,
                animation: 'pulse 1.5s infinite'
              }} />
              <Box sx={{ 
                height: 20, 
                backgroundColor: '#f0f0f0', 
                borderRadius: 1,
                width: '70%',
                animation: 'pulse 1.5s infinite'
              }} />
            </Box>
          ) : (
            <>
              {/* Kilos */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 1
              }}>
                <ScaleIcon 
                  sx={{ 
                    color: color, 
                    fontSize: '1.2rem' 
                  }} 
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#2c3e50',
                    fontSize: '1.5rem'
                  }}
                >
                  {tarjeta.stockKilos?.toFixed(1) || '0.0'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#7f8c8d',
                    fontWeight: 500
                  }}
                >
                  kg
                </Typography>
              </Box>

              {/* Unidades */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 1
              }}>
                <InventoryIcon 
                  sx={{ 
                    color: color, 
                    fontSize: '1.2rem' 
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#34495e',
                    fontSize: '1.2rem'
                  }}
                >
                  {tarjeta.stockUnidades || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#7f8c8d',
                    fontWeight: 500
                  }}
                >
                  unidades
                </Typography>
              </Box>

              {/* Total Pedido */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mb: 1
              }}>
                <ShoppingCartIcon 
                  sx={{ 
                    color: '#f39c12', 
                    fontSize: '1.1rem' 
                  }} 
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#e67e22',
                    fontSize: '1rem'
                  }}
                >
                  {tarjeta.totalPedido || 0}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#7f8c8d',
                    fontWeight: 500
                  }}
                >
                  pedido
                </Typography>
              </Box>

              {/* Próxima Entrega */}
              {tarjeta.proximaEntrega && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: 1
                }}>
                  <LocalShippingIcon 
                    sx={{ 
                      color: '#27ae60', 
                      fontSize: '1.1rem' 
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#27ae60',
                        fontSize: '1rem'
                      }}
                    >
                      {tarjeta.proximaEntrega.cantidad || 0}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#7f8c8d',
                        fontSize: '0.7rem'
                      }}
                    >
                      {tarjeta.proximaEntrega.fecha ? 
                        new Date(tarjeta.proximaEntrega.fecha).toLocaleDateString() : 
                        'Fecha N/A'
                      }
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Información adicional */}
              {tarjeta.itemIds && tarjeta.itemIds.length > 0 && (
                <Box sx={{ 
                  mt: 1.5,
                  pt: 1.5,
                  borderTop: '1px solid #ecf0f1'
                }}>
                                     <Typography 
                     variant="caption" 
                     sx={{ 
                       color: '#95a5a6',
                       fontSize: '0.75rem'
                     }}
                   >
                     {tarjeta.itemIds.length} item{tarjeta.itemIds.length !== 1 ? 's' : ''} configurado{tarjeta.itemIds.length !== 1 ? 's' : ''}
                   </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </CardContent>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Card>
  );
};
