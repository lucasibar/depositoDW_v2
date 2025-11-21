import React from 'react';
import { useSelector } from 'react-redux';

import './ConnectionStatus.css';

const ConnectionStatus = ({ showStats = false }) => {
  const { isOnline, pendingOperations, isSyncing } = useSelector(state => state.notificaciones);
  
  const pendingCount = pendingOperations?.length || 0;
  const failedCount = 0; // Ya no hay operaciones fallidas sin el servicio offline

  return (
    <div className="connection-status-indicator">
      <div className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
      <span className="status-text">
        {isOnline ? 'Conectado' : 'Sin conexión'}
      </span>
      
      {showStats && (
        <div className="status-stats">
          {pendingCount > 0 && (
            <span className="stat-badge pending" title={`${pendingCount} operaciones pendientes`}>
              {pendingCount}
            </span>
          )}
          {failedCount > 0 && (
            <span className="stat-badge failed" title={`${failedCount} operaciones fallidas`}>
              {failedCount}
            </span>
          )}
          {isSyncing && (
            <span className="syncing-indicator" title="Sincronizando...">
              🔄
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
