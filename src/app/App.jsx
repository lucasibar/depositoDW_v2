import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Login from '../pages/Login/Login';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import { DepositoPage, ComprasPage, AdminPage, CalidadPage, SalidaPage } from '../config/lazyImports';

// Componente de carga
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px',
    color: '#666',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px' }}>🔄</div>
      <div>Cargando...</div>
    </div>
  </div>
);

export const App = () => {
  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
        {/* Ruta de Depósito - Accesible para deposito, usuario, admin */}
        <Route 
          exact 
          path="/depositoDW_v2/deposito" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'usuario', 'admin']}>
              <DepositoPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Compras - Accesible solo para compras y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/compras" 
          element={
            <RoleProtectedRoute allowedRoles={['compras', 'admin']}>
              <ComprasPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Admin - Accesible solo para admin */}
        <Route 
          exact 
          path="/depositoDW_v2/admin" 
          element={
            <RoleProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Calidad - Accesible para calidad y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/calidad" 
          element={
            <RoleProtectedRoute allowedRoles={['calidad', 'admin']}>
              <CalidadPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Salida - Accesible para salida y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/salida" 
          element={
            <RoleProtectedRoute allowedRoles={['salida', 'admin']}>
              <SalidaPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Login */}
        <Route path="/depositoDW_v2/" element={<Login />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/depositoDW_v2/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}; 