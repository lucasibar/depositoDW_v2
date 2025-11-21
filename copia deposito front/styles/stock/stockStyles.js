export const headerContainerStyles = (isMobile) => ({
  p: isMobile ? 2 : 4,
  pb: 0
});

export const headerContentStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2
};

export const headerTitleWrapperStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 2
};

export const headerTitleStyles = {
  fontWeight: 700
};

export const searchWrapperStyles = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

export const searchIconStyles = {
  position: 'absolute',
  left: 12,
  color: 'text.secondary',
  fontSize: 20,
  zIndex: 1
};

export const searchInputStyles = {
  padding: '12px 12px 12px 44px',
  borderRadius: 25,
  border: '1px solid var(--color-border)',
  fontSize: '16px',
  outline: 'none',
  backgroundColor: 'transparent',
  minWidth: '300px',
  maxWidth: '500px',
  width: '400px'
};

export const exportButtonStyles = {
  color: 'text.secondary',
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  '&:disabled': {
    opacity: 0.3
  },
  transition: 'all 0.2s ease'
};

export const layoutWrapperStyles = (isMobile) => ({
  display: 'flex',
  gap: 2,
  p: isMobile ? 2 : 4,
  pt: 0,
  height: 'calc(100vh - 120px)',
  overflow: 'hidden'
});

export const metricsPanelContainerStyles = {
  flex: '0 0 200px',
  height: '100%',
  overflow: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 2,
  p: 2,
  backgroundColor: 'var(--color-surface)'
};

export const positionsListContainerStyles = {
  flex: '0 0 320px',
  height: '100%',
  overflow: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 2,
  p: 2,
  backgroundColor: 'var(--color-surface)'
};

export const positionCardStyles = (isSelected) => ({
  p: 2,
  mb: 1,
  borderRadius: 2,
  cursor: 'pointer',
  backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-background)',
  border: '1px solid var(--color-border)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-divider)',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
});

export const positionCardTitleStyles = {
  fontWeight: 600,
  mb: 0.5
};

export const positionDetailContainerStyles = {
  flex: 1,
  height: '100%',
  overflow: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 2,
  p: 3,
  backgroundColor: 'var(--color-surface)'
};

export const positionDetailEmptyStyles = {
  ...positionDetailContainerStyles,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export const positionDetailHeaderStyles = {
  mb: 3,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

export const addButtonStyles = {
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'var(--color-primary-dark)',
    transform: 'scale(1.05)'
  },
  transition: 'all 0.2s ease'
};

export const itemContainerStyles = (highlighted) => ({
  mb: 2,
  p: 2,
  border: highlighted ? '2px solid #4CAF50' : '1px solid var(--color-border)',
  borderRadius: 1,
  backgroundColor: highlighted ? '#E8F5E8' : 'transparent',
  transition: 'all 0.2s ease'
});

export const positionDetailTitleStyles = {
  fontWeight: 700,
  mb: 1
};

export const positionDetailSubtitleStyles = {
  color: 'text.secondary'
};

export const itemHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 1
};

export const itemTitleStyles = {
  fontWeight: 600
};

export const partidaRowStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: 0.5
};

export const partidaActionButtonStyles = {
  ml: 2,
  '&:hover': {
    backgroundColor: 'var(--color-primary-light)'
  }
};

