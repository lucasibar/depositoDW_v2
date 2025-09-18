import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Login from '../pages/Login/Login';

import { ComprasPage } from '../pages/ComprasPage/ComprasPage';
import { RemitoEntradaPage } from '../pages/RemitoEntradaPage/RemitoEntradaPage';
import { DashboardComprasPage } from '../pages/DashboardComprasPage/DashboardComprasPage';
import { AdminPage } from '../pages/AdminPage/AdminPage';
import { CalidadPage } from '../pages/CalidadPage/CalidadPage';
import { SalidaPage } from '../pages/SalidaPage/SalidaPage';
import { AdicionRapidaPage } from '../pages/AdicionRapidaPage/AdicionRapidaPage';
import { MaterialesPage } from '../pages/MaterialesPage/MaterialesPage';
import { PosicionesPage } from '../pages/PosicionesPage/PosicionesPage';
import { StockPage } from '../pages/StockPage/StockPage';
import { ReporteStockPage } from '../pages/ReporteStockPage/ReporteStockPage';
import PosicionesVaciasPage from '../pages/PosicionesVaciasPage';
import MapaPage from '../pages/MapaPage';
import MovimientosMercaderiaPage from '../pages/MovimientosMercaderiaPage';
import RoleProtectedRoute from '../components/RoleProtectedRoute';


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
        
        {/* Ruta de Adición Rápida - Accesible para deposito, usuario, admin */}
        <Route 
          exact 
          path="/depositoDW_v2/adicion-rapida" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'usuario', 'admin']}>
              <AdicionRapidaPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Materiales - Accesible para deposito, usuario, admin */}
        <Route 
          exact 
          path="/depositoDW_v2/materiales" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'usuario', 'admin']}>
              <MaterialesPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Posiciones - Accesible solo para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/posiciones" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <PosicionesPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Posiciones Vacías - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/posiciones-vacias" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <PosicionesVaciasPage />
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
        
        {/* Ruta de Movimientos Mercadería - Accesible para deposito y admin */}
        <Route 
          exact 
          path="/depositoDW_v2/movimientos-mercaderia" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <MovimientosMercaderiaPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Stock - Accesible para compras, admin y deposito */}
        <Route 
          exact 
          path="/depositoDW_v2/stock" 
          element={
            <RoleProtectedRoute allowedRoles={['compras', 'admin', 'deposito']}>
              <StockPage />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Ruta de Reporte Stock Consolidado - Accesible para compras, admin y deposito */}
        <Route 
          exact 
          path="/depositoDW_v2/reporte-stock" 
          element={
            <RoleProtectedRoute allowedRoles={['compras', 'admin', 'deposito']}>
              <ReporteStockPage />
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