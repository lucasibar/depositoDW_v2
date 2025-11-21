import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { authService } from '../../services/auth/authService';

const roleRedirect = {
  admin: '/depositoDW_v2/admin',
  compras: '/depositoDW_v2/compras',
  deposito: '/depositoDW_v2/deposito',
  salida: '/depositoDW_v2/deposito'
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigateByRole = (role) => {
    navigate(roleRedirect[role] || roleRedirect.deposito);
  };

  const handleChange = ({ target }) => {
    setFormData((prevData) => ({
      ...prevData,
      [target.name]: target.value
    }));
  };

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.username.trim(), formData.password);
      navigateByRole(response.role);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };
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
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Usuario"
        name="username"
        value={formData.username}
        onChange={handleChange}
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
        onChange={handleChange}
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

