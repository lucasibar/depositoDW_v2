import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Login from '../pages/Login/Login';

import { RemitoEntradaPage } from '../pages/RemitoEntradaPage/RemitoEntradaPage';
import { DashboardComprasPage } from '../pages/DashboardComprasPage/DashboardComprasPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { CalidadPage } from '../pages/CalidadPage/CalidadPage';
import { SalidaPage } from '../pages/SalidaPage/SalidaPage';
import MapaPage from '../pages/MapaPage';
import MapaChequeoTiempoPage from '../pages/MapaChequeoTiempoPage/MapaChequeoTiempoPage';
import DashboardTareasPage from '../pages/DashboardTareasPage/DashboardTareasPage';
import { ZonaPickingPage } from '../pages/ZonaPickingPage/ZonaPickingPage';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import StockPage from '../pages/StockPage/StockPage';
import { ReporteConsumoPage } from '../pages/ReporteConsumoPage/ReporteConsumoPage';


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
        
        {/* Ruta de Dashboard de Tareas - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/dashboard-tareas" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <DashboardTareasPage />
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
        
        {/* Ruta de Mapa de Chequeos por Tiempo - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/mapa-chequeos-tiempo" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <MapaChequeoTiempoPage />
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
        
        {/* Ruta de Órdenes de Pedido - Accesible para compras, admin y deposito */}
        <Route 
          exact 
          path="/depositoDW_v2/ordenes-pedido" 
          element={
            <RoleProtectedRoute allowedRoles={['compras', 'admin', 'deposito']}>
              <ZonaPickingPage />
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
        
        {/* Ruta de Login */}
        <Route path="/depositoDW_v2/" element={<Login />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/depositoDW_v2/" replace />} />
      </Routes>
      

    </div>
  );
}; 