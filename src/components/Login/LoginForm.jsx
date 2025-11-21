import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';
import {
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { buttonStyles, textFieldStyles } from '../../styles/login/loginStyles';

const LoginForm = ({
  formData,
  loading,
  error,
  onChange,
  onSubmit
}) => {

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const passwordAdornment = useMemo(
    () => (
      <InputAdornment position="end">
        <IconButton
          aria-label="alternar visibilidad de la contraseña"
          onClick={handleTogglePassword}
          edge="end"
          sx={{ color: 'var(--color-text-secondary)' }}
        >
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ),
    [showPassword, handleTogglePassword]
  );

  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        label="Usuario"
        name="username"
        value={formData.username}
        onChange={onChange}
        margin="normal"
        required
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: 'var(--color-text-secondary)' }} />
            </InputAdornment>
          )
        }}
        sx={textFieldStyles}
      />

      <TextField
        fullWidth
        label="Contraseña"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={onChange}
        margin="normal"
        required
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: 'var(--color-text-secondary)' }} />
            </InputAdornment>
          ),
          endAdornment: passwordAdornment
        }}
        sx={textFieldStyles}
      />

      {error && (
        <Alert
          severity="error"
          sx={{
            mt: 3,
            borderRadius: 'var(--border-radius-md)',
            '& .MuiAlert-icon': {
              color: 'var(--color-error)'
            }
          }}
        >
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        size="large"
        sx={buttonStyles}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} sx={{ color: 'white' }} />
            <span>Iniciando sesión...</span>
          </Box>
        ) : (
          'Iniciar Sesión'
        )}
      </Button>
    </form>
  );
};

export default LoginForm;

