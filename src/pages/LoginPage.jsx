import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { authService } from '../../services/auth/authService';
import { validateLoginForm, normalizeLoginData } from '../../utils/login/loginValidations';
import { LoginForm } from '../../components/Login/LoginForm';
import { LoginHeader } from '../../components/Login/LoginHeader';

const roleRedirect = {
  admin: '/depositoDW_v2/admin',
  compras: '/depositoDW_v2/compras',
  deposito: '/depositoDW_v2/deposito',
  salida: '/depositoDW_v2/deposito'
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = ({ target }) => {
    setFormData((prevData) => ({ ...prevData, [target.name]: target.value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validación del formulario (función pura de utils)
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    setLoading(true);

    try {
      // Normalizar datos (función pura de utils)
      const normalizedData = normalizeLoginData(formData);
      
      // Llamada al servicio de autenticación
      const response = await authService.login(normalizedData.username, normalizedData.password);
      
      // Redirección según el rol
      const redirectPath = roleRedirect[response.role];
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        throw new Error('Rol no válido');
      }
    } catch (loginError) {
      setError(loginError.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box >
        <Paper elevation={8} >
          <LoginHeader />
          <LoginForm
            formData={formData}
            loading={loading}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
            />
        </Paper>
    </Box>
  );
};

export default LoginPage;