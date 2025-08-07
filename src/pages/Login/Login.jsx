import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Alert,
  CircularProgress,
  Container,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { 
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { InputAdornment, IconButton } from '@mui/material';
import { authService } from '../../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          navigate('/depositoDW_v2/admin');
          break;
        case 'compras':
          navigate('/depositoDW_v2/compras');
          break;
        case 'deposito':
        case 'salida':
        default:
          navigate('/depositoDW_v2/deposito');
          break;
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 2 : 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
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
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 3,
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <LockIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                mb: 1
              }}
            >
              Der Will
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                fontSize: isMobile ? '1rem' : '1.1rem'
              }}
            >
              Sistema de Gestión de Depósito
            </Typography>
          </Box>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'var(--color-text-secondary)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 'var(--border-radius-md)',
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--color-primary)',
                },
              }}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'var(--color-text-secondary)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'var(--color-text-secondary)' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 'var(--border-radius-md)',
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--color-primary)',
                },
              }}
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
              sx={{
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
              }}
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

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem'
              }}
            >
              © 2024 Der Will. Todos los derechos reservados.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 