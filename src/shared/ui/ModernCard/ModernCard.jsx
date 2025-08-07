import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';

const ModernCard = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  elevation = 1,
  padding = 'normal',
  headerAction,
  className,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getPadding = () => {
    switch (padding) {
      case 'compact':
        return { p: 2 };
      case 'comfortable':
        return { p: 4 };
      case 'none':
        return { p: 0 };
      default:
        return { p: 3 };
    }
  };

  return (
    <Card
      elevation={elevation}
      sx={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--color-border)',
        transition: 'var(--transition-normal)',
        '&:hover': {
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-2px)'
        },
        ...props.sx
      }}
      className={className}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader
          title={
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              sx={{ 
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                mb: subtitle ? 0.5 : 0
              }}
            >
              {title}
            </Typography>
          }
          subheader={
            subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.4
                }}
              >
                {subtitle}
              </Typography>
            )
          }
          action={headerAction}
          sx={{
            pb: 1,
            '& .MuiCardHeader-content': {
              minWidth: 0
            }
          }}
        />
      )}
      
      <CardContent sx={{ ...getPadding(), pt: (title || subtitle) ? 0 : undefined }}>
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </CardContent>
      
      {actions && (
        <CardActions 
          sx={{ 
            p: 3, 
            pt: 0,
            gap: 1,
            flexWrap: 'wrap'
          }}
        >
          {actions}
        </CardActions>
      )}
    </Card>
  );
};

export default ModernCard; 