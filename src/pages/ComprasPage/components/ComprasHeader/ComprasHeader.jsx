import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/authService';
import styles from './ComprasHeader.module.css';

export const ComprasHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/deposito_dw_front/';
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1>Sistema de Compras</h1>
        <div className={styles.userInfo}>
          <span>Bienvenido, {user?.name}</span>
          <span className={styles.role}>({user?.role})</span>
          {user?.role === 'admin' && (
            <>
              <button 
                onClick={() => navigate('/deposito_dw_front/deposito')} 
                className={styles.navButton}
              >
                Depósito
              </button>
              <button 
                onClick={() => navigate('/deposito_dw_front/calidad')} 
                className={styles.navButton}
              >
                Calidad
              </button>
              <button 
                onClick={() => navigate('/deposito_dw_front/admin')} 
                className={styles.navButton}
              >
                Admin
              </button>
            </>
          )}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}; 