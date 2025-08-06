import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/authService';
import styles from './ComprasHeader.module.css';

export const ComprasHeader = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
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
                onClick={() => navigate('/depositoDW_v2/deposito')} 
                className={styles.navButton}
              >
                Depósito
              </button>
              <button 
                onClick={() => navigate('/depositoDW_v2/calidad')} 
                className={styles.navButton}
              >
                Calidad
              </button>
              <button 
                onClick={() => navigate('/depositoDW_v2/salida')} 
                className={styles.navButton}
              >
                Salida
              </button>
              <button 
                onClick={() => navigate('/depositoDW_v2/admin')} 
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