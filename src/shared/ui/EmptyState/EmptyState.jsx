import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import ModernCard from '../ModernCard/ModernCard';

const EmptyState = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  actionLabel, 
  onAction,
  showAction = true,
  sx = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ModernCard
      title={isMobile ? undefined : title}
      subtitle={isMobile ? undefined : subtitle}
      padding="comfortable"
      elevation={0}
      sx={{ 
        textAlign: 'center',
        backgroundColor: 'var(--color-background)',
        border: '2px dashed var(--color-border)',
        ...sx
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 2,
        py: 2
      }}>
        {Icon && (
          <Box sx={{ 
            color: 'var(--color-text-secondary)',
            fontSize: isMobile ? '3rem' : '4rem',
            opacity: 0.6
          }}>
            <Icon sx={{ fontSize: 'inherit' }} />
          </Box>
        )}
        
        <Box sx={{ maxWidth: 400 }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            sx={{ 
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              mb: 1
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {showAction && actionLabel && onAction && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAction}
            sx={{ 
              backgroundColor: 'var(--color-primary)',
              mt: 2
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Box>
    </ModernCard>
  );
};

export default EmptyState; 