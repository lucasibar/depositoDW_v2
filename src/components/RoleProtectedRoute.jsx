import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  // Debug logging
  console.log('RoleProtectedRoute Debug:', {
    isAuthenticated,
    user,
    allowedRoles,
    currentPath: window.location.pathname
  });

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('No autenticado, redirigiendo al login');
    return <Navigate to="/depositoDW_v2/" replace />;
  }

  // Si no tiene rol o el rol no está permitido, redirigir a la página correspondiente
  if (!user || !user.role) {
    console.log('Usuario sin rol, redirigiendo al login');
    return <Navigate to="/depositoDW_v2/" replace />;
  }

  // Verificar si el rol del usuario está permitido
  if (!allowedRoles.includes(user.role)) {
    console.log(`Rol ${user.role} no permitido. Roles permitidos:`, allowedRoles);
    // Redirigir según el rol del usuario
    switch (user.role) {
      case 'admin':
        return <Navigate to="/depositoDW_v2/admin" replace />;
      case 'compras':
        return <Navigate to="/depositoDW_v2/compras" replace />;
      case 'calidad':
        return <Navigate to="/depositoDW_v2/calidad" replace />;
      case 'salida':
        return <Navigate to="/depositoDW_v2/salida" replace />;
      case 'deposito':
      case 'usuario':
        return <Navigate to="/depositoDW_v2/deposito" replace />;
      default:
        return <Navigate to="/depositoDW_v2/deposito" replace />;
    }
  }

  console.log('Acceso permitido, renderizando componente');
  return children;
};

export default RoleProtectedRoute; 