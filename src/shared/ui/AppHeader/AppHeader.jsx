import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  Chip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRoleColor, getRoleLabel } from '../../../features/stock/utils/userUtils';
import { authService } from '../../../services/authService';

const AppHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/deposito_dw_front/';
  };

  const renderAdminButtons = () => {
    if (user.role !== 'admin') return null;

    return (
      <>
        <Button 
          color="inherit" 
          onClick={() => navigate('/deposito_dw_front/deposito')}
          sx={{ 
            border: '1px solid rgba(255,255,255,0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Depósito
        </Button>
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
    );
  };

  return (
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
          {renderAdminButtons()}
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
  );
};

export default AppHeader; 