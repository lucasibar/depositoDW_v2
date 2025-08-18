import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchNotificaciones,
  fetchNotificacionesStats,
  markNotificacionAsRead,
  markAllNotificacionesAsRead,
  deleteNotificacion,
  deleteAllNotificaciones,
  deleteReadNotificaciones
} from '../model/notificacionesSlice';
import { offlineSyncService } from '../services/offlineSyncService';
import './NotificacionesPanel.css';

const NotificacionesPanel = () => {
  const dispatch = useDispatch();
  const { 
    notificaciones, 
    stats,
    isOnline, 
    pendingOperations, 
    isSyncing,
    isLoading 
  } = useSelector(state => state.notificaciones);
  
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState('todas'); // todas, alerta, error, info

  useEffect(() => {
    dispatch(fetchNotificaciones());
    dispatch(fetchNotificacionesStats());
  }, [dispatch]);

  const handleMarcarComoLeida = (id) => {
    dispatch(markNotificacionAsRead(id));
  };

  const handleLimpiarLeidas = () => {
    dispatch(deleteReadNotificaciones());
  };

  const handleLimpiarTodas = () => {
    dispatch(deleteAllNotificaciones());
  };

  const handleSyncNow = () => {
    offlineSyncService.syncPendingOperations();
  };

  const handleClearFailed = () => {
    offlineSyncService.clearFailedOperations();
  };

  const getSyncStats = () => {
    return offlineSyncService.getSyncStats();
  };

  const syncStats = getSyncStats();

  const filteredNotificaciones = notificaciones.filter(notif => {
    if (filter === 'todas') return true;
    return notif.categoria === filter;
  });

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case 'alerta':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '📢';
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'alerta':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      case 'info':
        return 'var(--color-info)';
      case 'success':
        return 'var(--color-success)';
      default:
        return 'var(--color-primary)';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-AR');
  };

  return (
    <div className="notificaciones-panel">
      {/* Header con estadísticas */}
      <div className="notificaciones-header">
        <div className="notificaciones-title">
          <h3>Notificaciones del Sistema</h3>
          <div className="connection-status">
            <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢' : '🔴'}
            </span>
            <span>{isOnline ? 'Conectado' : 'Sin conexión'}</span>
          </div>
        </div>
        
        <div className="sync-stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">No leídas:</span>
            <span className="stat-value">{stats.unread}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Alertas:</span>
            <span className="stat-value warning">{stats.alertas}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Errores:</span>
            <span className="stat-value error">{stats.errores}</span>
          </div>
          {isSyncing && (
            <div className="syncing-indicator">
              <span className="spinner">🔄</span>
              Sincronizando...
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="notificaciones-controls">
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="todas">Todas las notificaciones</option>
            <option value="alerta">Alertas</option>
            <option value="error">Errores</option>
            <option value="info">Información</option>
            <option value="success">Éxitos</option>
          </select>
        </div>
        
                 <div className="action-controls">
           {syncStats.pendingCount > 0 && (
             <button 
               onClick={handleSyncNow}
               disabled={!isOnline || isSyncing}
               className="btn btn-primary"
             >
               Sincronizar Ahora
             </button>
           )}
           
           {syncStats.failedCount > 0 && (
             <button 
               onClick={handleClearFailed}
               className="btn btn-secondary"
             >
               Limpiar Fallidas
             </button>
           )}
          
          <button 
            onClick={handleLimpiarLeidas}
            className="btn btn-outline"
          >
            Limpiar Leídas
          </button>
          
          <button 
            onClick={handleLimpiarTodas}
            className="btn btn-outline"
          >
            Limpiar Todas
          </button>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="notificaciones-list">
        {filteredNotificaciones.length === 0 ? (
          <div className="no-notifications">
            <p>No hay notificaciones para mostrar</p>
          </div>
        ) : (
          filteredNotificaciones.map(notif => (
            <div 
              key={notif.id} 
              className={`notificacion-item ${notif.leida ? 'leida' : 'no-leida'}`}
              style={{ borderLeftColor: getCategoriaColor(notif.categoria) }}
            >
              <div className="notificacion-header">
                <div className="notificacion-icon">
                  {getCategoriaIcon(notif.categoria)}
                </div>
                                 <div className="notificacion-content">
                   <div className="notificacion-mensaje">
                     {notif.texto}
                   </div>
                   <div className="notificacion-meta">
                     <span className="notificacion-timestamp">
                       {formatTimestamp(notif.createdAt)}
                     </span>
                     <span className="notificacion-categoria">
                       {notif.categoria}
                     </span>
                     {notif.ruta && (
                       <span className="notificacion-ruta">
                         {notif.ruta}
                       </span>
                     )}
                   </div>
                 </div>
                <div className="notificacion-actions">
                  {!notif.leida && (
                    <button 
                      onClick={() => handleMarcarComoLeida(notif.id)}
                      className="btn-mark-read"
                      title="Marcar como leída"
                    >
                      ✓
                    </button>
                  )}
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="btn-toggle-details"
                    title="Ver detalles"
                  >
                    {showDetails ? '−' : '+'}
                  </button>
                </div>
              </div>
              
                             {showDetails && (notif.datosEnviados || notif.error) && (
                 <div className="notificacion-details">
                   {notif.datosEnviados && (
                     <div>
                       <h5>Datos Enviados:</h5>
                       <pre>{JSON.stringify(notif.datosEnviados, null, 2)}</pre>
                     </div>
                   )}
                   {notif.error && (
                     <div>
                       <h5>Error:</h5>
                       <pre>{notif.error}</pre>
                     </div>
                   )}
                 </div>
               )}
            </div>
          ))
        )}
      </div>

      {/* Operaciones pendientes */}
      {pendingOperations.length > 0 && (
        <div className="pending-operations">
          <h4>Operaciones Pendientes ({pendingOperations.length})</h4>
          <div className="operations-list">
            {pendingOperations.map(op => (
              <div 
                key={op.id} 
                className={`operation-item ${op.failed ? 'failed' : ''}`}
              >
                <div className="operation-info">
                  <span className="operation-type">{op.tipo}</span>
                  <span className="operation-timestamp">
                    {formatTimestamp(op.timestamp)}
                  </span>
                  {op.intentos > 0 && (
                    <span className="operation-attempts">
                      Intentos: {op.intentos}/{op.maxIntentos}
                    </span>
                  )}
                </div>
                {op.failed && (
                  <span className="operation-status failed">Fallida</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacionesPanel;
