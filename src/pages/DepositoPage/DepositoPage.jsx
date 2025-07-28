import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  AppBar, 
  Toolbar,
  Container
} from '@mui/material';
import { authService } from '../../services/authService';
import styles from './DepositoPage.module.css';

export const DepositoPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'gerente':
        return 'warning';
      case 'supervisor':
        return 'info';
      case 'operador':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'gerente':
        return 'Gerente';
      case 'supervisor':
        return 'Supervisor';
      case 'operador':
        return 'Operador';
      default:
        return role;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Der Will - Sistema de Gestión
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Bienvenido, {user.name}
            </Typography>
            <Chip 
              label={getRoleLabel(user.role)} 
              color={getRoleColor(user.role)}
              size="small"
            />
            {user.role === 'admin' && (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/deposito_dw_front/compras')}
                  sx={{ 
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Compras
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/deposito_dw_front/admin')}
                  sx={{ 
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Admin
                </Button>
              </>
            )}
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{ 
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <div className={styles.container}>
          <Typography variant="h4" gutterBottom>
            Panel de Control - Depósito
          </Typography>
          
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Información del Usuario
            </Typography>
            <Typography variant="body1">
              <strong>Usuario:</strong> {user.name}
            </Typography>
            <Typography variant="body1">
              <strong>Rol:</strong> {getRoleLabel(user.role)}
            </Typography>
            <Typography variant="body1">
              <strong>Permisos:</strong> 
              {user.role === 'admin' && ' Acceso completo al sistema'}
              {user.role === 'gerente' && ' Gestión de inventarios y reportes'}
              {user.role === 'supervisor' && ' Supervisión de operaciones'}
              {user.role === 'operador' && ' Operaciones básicas de depósito'}
            </Typography>
          </Box>

          <div className={styles.mainContent}>
            <div className={styles.listContainer}>
              <Typography variant="h6" gutterBottom>
                Funcionalidades Disponibles
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Aquí se mostrarán las funcionalidades específicas según el rol del usuario.
              </Typography>
            </div>
            <div className={styles.chartContainer}>
              <Typography variant="h6" gutterBottom>
                Estadísticas
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gráficos y estadísticas del depósito.
              </Typography>
            </div>
          </div>
        </div>
      </Container>
    </Box>
  );
}; 