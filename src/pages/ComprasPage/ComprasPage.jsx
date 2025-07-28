import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ComprasPage.module.css';
import { authService } from '../../services/authService';

export const ComprasPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('proveedores');

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/deposito_dw_front/';
  };

  const renderProveedoresTab = () => (
    <div className={styles.tabContent}>
      <h3>Gestión de Proveedores</h3>
      <div className={styles.card}>
        <h4>Lista de Proveedores</h4>
        <p>Aquí se mostrarán los proveedores registrados en el sistema.</p>
        <button className={styles.primaryButton}>Agregar Proveedor</button>
      </div>
    </div>
  );

  const renderOrdenesTab = () => (
    <div className={styles.tabContent}>
      <h3>Órdenes de Compra</h3>
      <div className={styles.card}>
        <h4>Órdenes Pendientes</h4>
        <p>Gestión de órdenes de compra y seguimiento de pedidos.</p>
        <button className={styles.primaryButton}>Nueva Orden</button>
      </div>
    </div>
  );

  const renderPresupuestosTab = () => (
    <div className={styles.tabContent}>
      <h3>Presupuestos</h3>
      <div className={styles.card}>
        <h4>Control de Presupuestos</h4>
        <p>Análisis y control de presupuestos de compras.</p>
        <button className={styles.primaryButton}>Crear Presupuesto</button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
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

      <nav className={styles.navigation}>
        <button 
          className={`${styles.navButton} ${activeTab === 'proveedores' ? styles.active : ''}`}
          onClick={() => setActiveTab('proveedores')}
        >
          Proveedores
        </button>
        <button 
          className={`${styles.navButton} ${activeTab === 'ordenes' ? styles.active : ''}`}
          onClick={() => setActiveTab('ordenes')}
        >
          Órdenes de Compra
        </button>
        <button 
          className={`${styles.navButton} ${activeTab === 'presupuestos' ? styles.active : ''}`}
          onClick={() => setActiveTab('presupuestos')}
        >
          Presupuestos
        </button>
      </nav>

      <main className={styles.main}>
        {activeTab === 'proveedores' && renderProveedoresTab()}
        {activeTab === 'ordenes' && renderOrdenesTab()}
        {activeTab === 'presupuestos' && renderPresupuestosTab()}
      </main>
    </div>
  );
}; 