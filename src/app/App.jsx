import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Login from '../pages/Login/Login';

import { RemitoEntradaPage } from '../pages/RemitoEntradaPage/RemitoEntradaPage';
import { DashboardComprasPage } from '../pages/DashboardComprasPage/DashboardComprasPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { CalidadPage } from '../pages/CalidadPage/CalidadPage';
import MapaPage from '../pages/MapaPage';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import StockPage from '../pages/StockPage/StockPage';
import { ReporteConsumoPage } from '../pages/ReporteConsumoPage/ReporteConsumoPage';
import ChecklistChequeoPage from '../pages/ChecklistChequeoPage/ChecklistChequeoPage';
import RemitosSalidaPage from '../pages/RemitosSalidaPage/RemitosSalidaPage';

import { useAuthSync } from '../features/auth/hooks/useAuthSync';
import { setStore } from '../services/authService';

export const App = () => {
  const user = useSelector(state => state.auth.user);
  
  // Sincronizar auth con localStorage
  useAuthSync();

  useEffect(() => {
    // Inicializar servicios cuando el store esté disponible
    import('../app/providers/store').then(({ store }) => {
      // Configurar el store en authService
      setStore(store);
    });
  }, [user]);

  return (
    <div className="App">
      <Routes>

        {/* Ruta de Remito Entrada - Accesible solo para compras y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/remito-entrada" 
          element={
            <RoleProtectedRoute allowedRoles={['compras', 'admin']}>
              <RemitoEntradaPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Dashboard de Compras - Accesible solo para compras y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/dashboard-compras" 
          element={
            <RoleProtectedRoute allowedRoles={['compras', 'admin']}>
              <DashboardComprasPage />
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
        
        {/* Ruta de Mapa - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/mapa" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <MapaPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Chequeo de Posiciones - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/chequeo-posiciones" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <ChecklistChequeoPage />
            </RoleProtectedRoute>
          } 
        />

        {/* Ruta de Stock - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/posiciones-composicion" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <StockPage />
            </RoleProtectedRoute>
          } 
        />
        {/* Ruta de Reporte de Consumo - Accesible para admin y deposito */}
        <Route 
          exact 
          path="/depositoDW_v2/reporte-consumo" 
          element={
            <RoleProtectedRoute allowedRoles={['admin', 'deposito']}>
              <ReporteConsumoPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Remitos de Salida - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/remitos-salida" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <RemitosSalidaPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Login */}
        <Route path="/depositoDW_v2/" element={<Login />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/depositoDW_v2/" replace />} />
      </Routes>
      

    </div>
  );
}; 