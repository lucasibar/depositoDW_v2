import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { authService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData.username, formData.password);
      
      // Redirigir según el rol del usuario
      switch (response.role) {
        case 'admin':
          navigate('/deposito_dw_front/admin');
          break;
        case 'compras':
          navigate('/deposito_dw_front/compras');
          break;
        case 'deposito':
        case 'salida':
        default:
          navigate('/deposito_dw_front/deposito');
          break;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ padding: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            align="center" 
            gutterBottom
            sx={{ color: '#2e7d32', fontWeight: 'bold' }}
          >
            Der Will
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            align="center" 
            color="textSecondary" 
            gutterBottom
          >
            Sistema de Gestión de Depósito
          </Typography>

          <form onSubmit={handleSubmit} style={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#2e7d32',
                '&:hover': {
                  backgroundColor: '#1b5e20'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Ingresar'}
            </Button>
          </form>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 