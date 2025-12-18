import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth/authService';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/depositoDW_v2/login" replace />;
  }

  // Verificar si el rol del usuario está permitido
  if (!allowedRoles.includes(user.role)) {
    // Redirigir según el rol del usuario
    switch (user.role) {
      case 'admin':
        return <Navigate to="/depositoDW_v2/deposito" replace />;
      case 'deposito':
        return <Navigate to="/depositoDW_v2/deposito" replace />;
      default:
        return <Navigate to="/depositoDW_v2/login" replace />;
    }
  }

  return children;
};

export default RoleProtectedRoute; 
