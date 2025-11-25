import React, { useCallback, useState } from 'react';
import {
  Button,
  IconButton,
  TextField
} from '@mui/material';
import { Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { buttonStyles } from '../../styles/login/loginStyles';
import { authService } from '../../services/auth/authService';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '../../shared/loading/LoadingButton';
import { roleRedirect } from '../../utils/routes';


const LoginForm = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    setFormData((prevData) => ({ ...prevData, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData.username, formData.password);
     
     console.log(response)
      const redirectPath = roleRedirect[response.role];
      
      if (!redirectPath) {throw new Error('Rol no válido')}
      
      navigate(redirectPath);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = useCallback(() => {setShowPassword((prevState) => !prevState)}, []);

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
        InputProps={{startAdornment: (<Person sx={{ color: 'var(--color-text-secondary)' }} />)}}
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
          startAdornment: (<Lock sx={{ color: 'var(--color-text-secondary)' }} />),
          endAdornment: (
              <IconButton
                aria-label="alternar visibilidad de la contraseña"
                onClick={handleTogglePassword}
                edge="end"
                sx={{ color: 'var(--color-text-secondary)' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
          )
        }}
      />



      <Button type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        size="large"
        sx={buttonStyles}
      >
        <LoadingButton loading={loading} loadingText="Iniciando sesión...">
          Iniciar Sesión
        </LoadingButton>
      </Button>
    </form>
  );
};

export default LoginForm;

