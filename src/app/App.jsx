import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Login from '../pages/Login/Login';
import { DepositoPage } from '../pages/DepositoPage/DepositoPage';
import { ComprasPage } from '../pages/ComprasPage/ComprasPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import RoleProtectedRoute from '../components/RoleProtectedRoute';

export const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* Ruta de Depósito - Accesible para deposito, usuario, admin */}
        <Route 
          exact 
          path="/deposito_dw_front/deposito" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'usuario', 'admin']}>
              <DepositoPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Compras - Accesible solo para compras y admin */}
        <Route 
          exact 
          path="/deposito_dw_front/compras" 
          element={
            <RoleProtectedRoute allowedRoles={['compras', 'admin']}>
              <ComprasPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Admin - Accesible solo para admin */}
        <Route 
          exact 
          path="/deposito_dw_front/admin" 
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Login */}
        <Route path="/deposito_dw_front/" element={<Login />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/deposito_dw_front/" replace />} />
      </Routes>
    </div>
  );
}; 