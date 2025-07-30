import React, { useState } from 'react';
import { TabNavigation } from '../../shared/ui/TabNavigation/TabNavigation';
import { ComprasHeader } from './components/ComprasHeader/ComprasHeader';
import { RemitosTab } from './components/RemitosTab/RemitosTab';
import { StockTab } from './components/StockTab/StockTab';
import { OrdenesCompraTab } from './components/OrdenesCompraTab/OrdenesCompraTab';
import { PresupuestoTab } from './components/PresupuestoTab/PresupuestoTab';
import { useAuth } from '../../hooks/useAuth';
import styles from './ComprasPage.module.css';

const TABS = [
  { id: 'remitos', label: 'Remitos', component: RemitosTab },
  { id: 'stock', label: 'Stock', component: StockTab },
  { id: 'ordenes', label: 'Órdenes de Compra', component: OrdenesCompraTab },
  { id: 'presupuesto', label: 'Presupuesto', component: PresupuestoTab },
];

export const ComprasPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stock');

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={styles.container}>
      <ComprasHeader user={user} />

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