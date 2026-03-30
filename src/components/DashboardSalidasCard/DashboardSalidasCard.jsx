import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Scale as ScaleIcon,
  History as HistoryIcon
} from '@mui/icons-material';

export const DashboardSalidasCard = ({ 
  tarjeta, 
  onClick, 
  onConfigClick,
  isLoading = false 
}) => {
  const color = tarjeta.color || '#3f51b5';

  return (
    <Card 
      sx={{
        background: 'white',
        border: `2px solid ${color}20`,
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}20`,
          borderColor: `${color}40`
        }
      }}
      onClick={() => onClick?.(tarjeta)}
    >
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
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              backgroundColor: `${color}15`, 
              p: 1, 
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HistoryIcon sx={{ color: color }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: '#2c3e50',
                  fontSize: '1rem',
                  lineHeight: 1.2
                }}
              >
                {tarjeta.nombreCombo}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Configurar combo">
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

        <Box sx={{ mt: 3 }}>
          {isLoading ? (
            <Box sx={{ height: 40, backgroundColor: '#f5f5f5', borderRadius: 1, animation: 'pulse 1.5s infinite' }} />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'baseline', 
              gap: 1
            }}>
              <ScaleIcon 
                sx={{ 
                  color: color, 
                  fontSize: '1.2rem',
                  mb: -0.5
                }} 
              />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  color: '#2c3e50',
                  letterSpacing: '-0.5px'
                }}
              >
                {tarjeta.totalKilos?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '0.0'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#7f8c8d',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem'
                }}
              >
                kg consumidos
              </Typography>
            </Box>
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
