import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabNavigation } from '../../shared/ui/TabNavigation/TabNavigation';
import { RemitosTab } from './components/RemitosTab/RemitosTab';
import { StockTab } from './components/StockTab/StockTab';
import { OrdenesCompraTab } from './components/OrdenesCompraTab/OrdenesCompraTab';
import { PresupuestoTab } from './components/PresupuestoTab/PresupuestoTab';
import { authService } from '../../services/authService';
import styles from './ComprasPage.module.css';

const TABS = [
  { id: 'remitos', label: 'Remitos', component: RemitosTab },
  { id: 'stock', label: 'Stock', component: StockTab },
  { id: 'ordenes', label: 'Órdenes de Compra', component: OrdenesCompraTab },
  { id: 'presupuesto', label: 'Presupuesto', component: PresupuestoTab },
];

export const ComprasPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('stock');

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/deposito_dw_front/';
  };

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component;

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

      <main className={styles.main}>
        <TabNavigation 
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className={styles.tabContent}>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};