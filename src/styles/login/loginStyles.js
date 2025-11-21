export const getContainerStyles = (isMobile) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: isMobile ? 2 : 4
});

export const getPaperStyles = (isMobile) => ({
  p: isMobile ? 3 : 4,
  borderRadius: 'var(--border-radius-lg)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-lg)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
  }
});

export const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 'var(--border-radius-md)',
    '&:hover fieldset': {
      borderColor: 'var(--color-primary)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary)'
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--color-primary)'
  }
};

export const buttonStyles = {
  mt: 4,
  mb: 2,
  py: 1.5,
  backgroundColor: 'var(--color-primary)',
  borderRadius: 'var(--border-radius-md)',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'var(--shadow-sm)',
  '&:hover': {
    backgroundColor: 'var(--color-primary-dark)',
    boxShadow: 'var(--shadow-md)',
    transform: 'translateY(-1px)'
  },
  '&:disabled': {
    backgroundColor: 'var(--color-text-disabled)',
    transform: 'none'
  },
  transition: 'var(--transition-normal)'
};

