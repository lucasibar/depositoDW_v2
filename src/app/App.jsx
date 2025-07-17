import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from '../pages/Login/Login';
import { DepositoPage } from '../pages/deposito/DepositoPage';

export const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/deposito_dw_front/deposito" element={<DepositoPage />} />
        <Route path="*" element={<Navigate to="/deposito_dw_front/" element={<Login />} replace />} />
      </Routes>
    </div>
  );
}; 