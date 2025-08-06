import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.css';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

export const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [creatingUsers, setCreatingUsers] = useState(false);
  const [userCreationResult, setUserCreationResult] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/depositoDW_v2/';
  };

  const handleCreateDefaultUsers = async () => {
    setCreatingUsers(true);
    setUserCreationResult(null);
    
    try {
      const result = await userService.createDefaultUsers();
      setUserCreationResult(result);
    } catch (error) {
      setUserCreationResult({
        message: 'Error creando usuarios',
        error: error.message
      });
    } finally {
      setCreatingUsers(false);
    }
  };

  const renderDashboardTab = () => (
    <div className={styles.tabContent}>
      <h3>Dashboard de Administración</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h4>Usuarios Totales</h4>
          <div className={styles.statNumber}>24</div>
          <p>Usuarios registrados en el sistema</p>
        </div>
        
        <div className={styles.statCard}>
          <h4>Artículos en Stock</h4>
          <div className={styles.statNumber}>1,247</div>
          <p>Artículos disponibles</p>
        </div>
        
        <div className={styles.statCard}>
          <h4>Movimientos Hoy</h4>
          <div className={styles.statNumber}>89</div>
          <p>Movimientos realizados hoy</p>
        </div>
        
        <div className={styles.statCard}>
          <h4>Proveedores Activos</h4>
          <div className={styles.statNumber}>12</div>
          <p>Proveedores con actividad reciente</p>
        </div>
      </div>

      <div className={styles.card}>
        <h4>Actividad Reciente</h4>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>10:30</span>
            <span className={styles.activityText}>Nuevo usuario registrado: Juan Pérez</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>09:15</span>
            <span className={styles.activityText}>Movimiento de stock: Entrada de 50 unidades</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>08:45</span>
            <span className={styles.activityText}>Nuevo proveedor agregado: TextilCorp S.A.</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className={styles.tabContent}>
      <h3>Gestión de Usuarios</h3>
      <div className={styles.card}>
        <h4>Crear Usuarios por Defecto</h4>
        <p>Crea los usuarios básicos del sistema con roles específicos.</p>
        <button 
          className={styles.primaryButton} 
          onClick={handleCreateDefaultUsers}
          disabled={creatingUsers}
        >
          {creatingUsers ? 'Creando...' : 'Crear Usuarios por Defecto'}
        </button>
        
        {userCreationResult && (
          <div className={styles.resultCard}>
            <h5>Resultado de la Creación:</h5>
            <p><strong>Mensaje:</strong> {userCreationResult.message}</p>
            
            {userCreationResult.summary && (
              <div className={styles.summary}>
                <p><strong>Resumen:</strong></p>
                <ul>
                  <li>Creados: {userCreationResult.summary.created}</li>
                  <li>Ya existían: {userCreationResult.summary.exists}</li>
                  <li>Errores: {userCreationResult.summary.errors}</li>
                </ul>
              </div>
            )}
            
            {userCreationResult.results && (
              <div className={styles.results}>
                <p><strong>Detalles:</strong></p>
                {userCreationResult.results.map((result, index) => (
                  <div key={index} className={`${styles.resultItem} ${styles[result.status]}`}>
                    <span className={styles.userName}>{result.name}</span>
                    <span className={styles.status}>{result.status}</span>
                    <span className={styles.message}>{result.message}</span>
                    {result.role && <span className={styles.role}>Rol: {result.role}</span>}
                    {result.password && <span className={styles.password}>Contraseña: {result.password}</span>}
                  </div>
                ))}
              </div>
            )}
            
            {userCreationResult.error && (
              <div className={styles.error}>
                <p><strong>Error:</strong> {userCreationResult.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.card}>
        <h4>Lista de Usuarios</h4>
        <p>Administración de usuarios del sistema y sus permisos.</p>
        <button className={styles.primaryButton}>Agregar Usuario</button>
        <button className={styles.secondaryButton}>Editar Permisos</button>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className={styles.tabContent}>
      <h3>Configuración del Sistema</h3>
      <div className={styles.card}>
        <h4>Configuraciones Generales</h4>
        <p>Configuración de parámetros del sistema y mantenimiento.</p>
        <button className={styles.primaryButton}>Configurar Sistema</button>
        <button className={styles.warningButton}>Respaldar Base de Datos</button>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className={styles.tabContent}>
      <h3>Reportes y Análisis</h3>
      <div className={styles.card}>
        <h4>Generación de Reportes</h4>
        <p>Reportes de actividad, inventario y análisis de datos.</p>
        <button className={styles.primaryButton}>Generar Reporte</button>
        <button className={styles.secondaryButton}>Ver Historial</button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Panel de Administración</h1>
          <div className={styles.userInfo}>
            <span>Administrador: {user?.name}</span>
            <span className={styles.role}>({user?.role})</span>
            <button 
              onClick={() => navigate('/depositoDW_v2/deposito')} 
              className={styles.navButton}
            >
              Depósito
            </button>
            <button 
              onClick={() => navigate('/depositoDW_v2/compras')} 
              className={styles.navButton}
            >
              Compras
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
            <button onClick={handleLogout} className={styles.logoutButton}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <nav className={styles.navigation}>
        <button 
          className={`${styles.navButton} ${activeTab === 'dashboard' ? styles.active : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`${styles.navButton} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Usuarios
        </button>
        <button 
          className={`${styles.navButton} ${activeTab === 'system' ? styles.active : ''}`}
          onClick={() => setActiveTab('system')}
        >
          Sistema
        </button>
        <button 
          className={`${styles.navButton} ${activeTab === 'reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reportes
        </button>
      </nav>

      <main className={styles.main}>
        {activeTab === 'dashboard' && renderDashboardTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'system' && renderSystemTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </main>
    </div>
  );
}; 