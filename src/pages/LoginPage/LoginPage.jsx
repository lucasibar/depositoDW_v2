import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Paper, useMediaQuery, useTheme } from '@mui/material';
import { authService } from '../../services/auth/authService';
import { LoginFooter, LoginForm, LoginHeader } from '../../components/Login';
import { getContainerStyles, getPaperStyles } from '../../styles/login/loginStyles';

const roleRedirect = {
  admin: '/depositoDW_v2/admin',
  compras: '/depositoDW_v2/compras',
  deposito: '/depositoDW_v2/deposito',
  salida: '/depositoDW_v2/deposito'
};

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  return (
    <Box sx={getContainerStyles(isMobile)}>
      <Container maxWidth="sm">
        <Paper elevation={8} sx={getPaperStyles(isMobile)}>
          <LoginHeader isMobile={isMobile} />
          <LoginForm
            formData={formData}
            loading={loading}
            error={error}
            showPassword={showPassword}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onTogglePassword={handleTogglePassword}
          />
          <LoginFooter />
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;