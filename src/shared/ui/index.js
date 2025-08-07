// ===== SISTEMA DE DISEÑO - COMPONENTES EXPORTADOS =====

// Layout Components
export { default as AppLayout } from './AppLayout/AppLayout';

// Card Components
export { default as ModernCard } from './ModernCard/ModernCard';

// Button Components
export { default as ModernButton } from './ModernButton/ModernButton';

// Table Components
export { default as ModernTable } from './ModernTable/ModernTable';

// Existing Components (mantener compatibilidad)
export { SearchBar } from './SearchBar/SearchBar';
export { AdvancedFilters } from './AdvancedFilters/AdvancedFilters';
export { MaterialCard } from './MaterialCard/MaterialCard';
export { PosicionCard } from './PosicionCard/PosicionCard';
export { TabNavigation } from './TabNavigation/TabNavigation';

// ===== UTILIDADES DEL SISTEMA DE DISEÑO =====

// Colores del sistema
export const DESIGN_COLORS = {
  primary: 'var(--color-primary)',
  primaryLight: 'var(--color-primary-light)',
  primaryDark: 'var(--color-primary-dark)',
  secondary: 'var(--color-secondary)',
  secondaryLight: 'var(--color-secondary-light)',
  secondaryDark: 'var(--color-secondary-dark)',
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--color-warning)',
  info: 'var(--color-info)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textDisabled: 'var(--color-text-disabled)',
  border: 'var(--color-border)',
  divider: 'var(--color-divider)'
};

// Espaciado del sistema
export const DESIGN_SPACING = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  xxl: 'var(--spacing-xxl)'
};

// Sombras del sistema
export const DESIGN_SHADOWS = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)'
};

// Transiciones del sistema
export const DESIGN_TRANSITIONS = {
  fast: 'var(--transition-fast)',
  normal: 'var(--transition-normal)',
  slow: 'var(--transition-slow)'
};

// Border radius del sistema
export const DESIGN_BORDER_RADIUS = {
  sm: 'var(--border-radius-sm)',
  md: 'var(--border-radius-md)',
  lg: 'var(--border-radius-lg)'
};

// ===== FUNCIONES UTILITARIAS =====

// Función para obtener estilos de botón consistentes
export const getButtonStyles = (variant = 'contained', color = 'primary', size = 'medium') => {
  const baseStyles = {
    borderRadius: DESIGN_BORDER_RADIUS.md,
    textTransform: 'none',
    fontWeight: 600,
    transition: DESIGN_TRANSITIONS.normal,
    boxShadow: DESIGN_SHADOWS.sm,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: DESIGN_SHADOWS.md
    },
    '&:active': {
      transform: 'translateY(0)'
    },
    '&:disabled': {
      transform: 'none',
      boxShadow: 'none'
    }
  };

  return baseStyles;
};

// Función para obtener estilos de tarjeta consistentes
export const getCardStyles = (elevation = 1) => ({
  backgroundColor: DESIGN_COLORS.surface,
  borderRadius: DESIGN_BORDER_RADIUS.lg,
  border: `1px solid ${DESIGN_COLORS.border}`,
  transition: DESIGN_TRANSITIONS.normal,
  boxShadow: elevation === 1 ? DESIGN_SHADOWS.sm : DESIGN_SHADOWS.md,
  '&:hover': {
    boxShadow: DESIGN_SHADOWS.md,
    transform: 'translateY(-2px)'
  }
});

// Función para obtener estilos de tabla consistentes
export const getTableStyles = () => ({
  borderRadius: DESIGN_BORDER_RADIUS.lg,
  backgroundColor: DESIGN_COLORS.surface,
  boxShadow: DESIGN_SHADOWS.sm,
  overflow: 'hidden'
});

// ===== CONSTANTES DE RESPONSIVE =====

export const BREAKPOINTS = {
  mobile: 'max-width: 768px',
  tablet: 'min-width: 768px) and (max-width: 1024px',
  desktop: 'min-width: 1024px'
};

// ===== TIPOS DE COMPONENTES =====

// Tipos de botón disponibles
export const BUTTON_VARIANTS = {
  CONTAINED: 'contained',
  OUTLINED: 'outlined',
  TEXT: 'text'
};

// Tipos de color disponibles
export const BUTTON_COLORS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning'
};

// Tipos de tamaño disponibles
export const BUTTON_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

// Tipos de celda de tabla
export const TABLE_CELL_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  CURRENCY: 'currency',
  CHIP: 'chip',
  STATUS: 'status'
};

// ===== DOCUMENTACIÓN RÁPIDA =====

/**
 * SISTEMA DE DISEÑO - USO RÁPIDO
 * 
 * 1. Importar componentes:
 *    import { ModernCard, ModernButton, AppLayout } from '../shared/ui';
 * 
 * 2. Usar variables CSS:
 *    sx={{ color: 'var(--color-primary)' }}
 * 
 * 3. Usar espaciado consistente:
 *    sx={{ p: 'var(--spacing-md)' }}
 * 
 * 4. Usar sombras:
 *    sx={{ boxShadow: 'var(--shadow-md)' }}
 * 
 * 5. Usar transiciones:
 *    sx={{ transition: 'var(--transition-normal)' }}
 */ 