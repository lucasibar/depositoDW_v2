import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { ReporteConsumoPage } from '../pages/ReporteConsumoPage/ReporteConsumoPage';

import StockPage from '../pages/StockPage/StockPage';
import LoginPage from '../pages/LoginPage/LoginPage';

export const App = () => {

  return (
    <div className="App">
      <Routes>
      <Route 
          exact 
          path="/depositoDW_v2/posiciones-composicion" 
          element={
            <RoleProtectedRoute allowedRoles={['deposito', 'admin']}>
              <StockPage />
            </RoleProtectedRoute>
          } 
        />
      <Route path="/depositoDW_v2/login" element={<LoginPage />} />

      <Route path="*" element={<Navigate to="/depositoDW_v2/login" replace />} />

      </Routes>
      

    </div>
  );
}; 