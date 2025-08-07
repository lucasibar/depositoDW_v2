import React from 'react';
import { Button, CircularProgress, useTheme, useMediaQuery } from '@mui/material';

const ModernButton = ({ 
  children, 
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: 'var(--border-radius-md)',
      textTransform: 'none',
      fontWeight: 600,
      transition: 'var(--transition-normal)',
      boxShadow: 'var(--shadow-sm)',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: 'var(--shadow-md)'
      },
      '&:active': {
        transform: 'translateY(0)'
      },
      '&:disabled': {
        transform: 'none',
        boxShadow: 'none'
      }
    };

    const sizeStyles = {
      small: {
        padding: '6px 16px',
        fontSize: '0.875rem',
        minHeight: '32px'
      },
      medium: {
        padding: '8px 24px',
        fontSize: '1rem',
        minHeight: '40px'
      },
      large: {
        padding: '12px 32px',
        fontSize: '1.125rem',
        minHeight: '48px'
      }
    };

    const colorStyles = {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        '&:hover': {
          backgroundColor: 'var(--color-primary-dark)'
        },
        '&:disabled': {
          backgroundColor: 'var(--color-text-disabled)',
          color: 'var(--color-text-secondary)'
        }
      },
      secondary: {
        backgroundColor: 'var(--color-secondary)',
        color: 'white',
        '&:hover': {
          backgroundColor: 'var(--color-secondary-dark)'
        },
        '&:disabled': {
          backgroundColor: 'var(--color-text-disabled)',
          color: 'var(--color-text-secondary)'
        }
      },
      success: {
        backgroundColor: 'var(--color-success)',
        color: 'white',
        '&:hover': {
          backgroundColor: '#388E3C'
        },
        '&:disabled': {
          backgroundColor: 'var(--color-text-disabled)',
          color: 'var(--color-text-secondary)'
        }
      },
      error: {
        backgroundColor: 'var(--color-error)',
        color: 'white',
        '&:hover': {
          backgroundColor: '#D32F2F'
        },
        '&:disabled': {
          backgroundColor: 'var(--color-text-disabled)',
          color: 'var(--color-text-secondary)'
        }
      },
      warning: {
        backgroundColor: 'var(--color-warning)',
        color: 'white',
        '&:hover': {
          backgroundColor: '#F57C00'
        },
        '&:disabled': {
          backgroundColor: 'var(--color-text-disabled)',
          color: 'var(--color-text-secondary)'
        }
      }
    };

    const variantStyles = {
      contained: {
        ...colorStyles[color]
      },
      outlined: {
        backgroundColor: 'transparent',
        border: `2px solid ${color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
        color: color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)',
        '&:hover': {
          backgroundColor: color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)',
          color: 'white'
        },
        '&:disabled': {
          borderColor: 'var(--color-text-disabled)',
          color: 'var(--color-text-disabled)',
          backgroundColor: 'transparent'
        }
      },
      text: {
        backgroundColor: 'transparent',
        color: color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: color === 'primary' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(25, 118, 210, 0.1)'
        },
        '&:disabled': {
          color: 'var(--color-text-disabled)',
          backgroundColor: 'transparent'
        }
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <CircularProgress 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            sx={{ color: 'inherit', mr: 1 }} 
          />
          Cargando...
        </>
      );
    }

    return children;
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      sx={{
        ...getButtonStyles(),
        ...sx
      }}
      {...props}
    >
      {renderContent()}
    </Button>
  );
};

export default ModernButton; 