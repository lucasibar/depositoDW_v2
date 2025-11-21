import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";

import StockPage from '../pages/StockPage';
import LoginPage from '../pages/LoginPage';
import RoleProtectedRoute from '../shared/roleProtectedRoute/RoleProtectedRoute'
export const App = () => {

  return (
    <div className="App">
      <Routes>
      <Route 
          exact 
          path="/depositoDW_v2/deposito" 
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