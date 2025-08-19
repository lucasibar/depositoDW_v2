import React, { useState, useEffect } from 'react';
import { cacheService } from '../services/cacheService';
import { optimizedApiClient } from '../services/optimizedApiClient';
import { useSelector } from 'react-redux';

const PerformanceIndicator = () => {
  const notificacionesState = useSelector(state => state.notificaciones);
  
  const [stats, setStats] = useState({
    cache: { size: 0, memoryUsage: 0 },
    connectivity: true,
    lastUpdate: Date.now()
  });

  useEffect(() => {
    const updateStats = () => {
      try {
        setStats({
          cache: cacheService.getStats(),
          connectivity: notificacionesState?.isOnline ?? navigator.onLine ?? true,
          lastUpdate: Date.now()
        });
      } catch (error) {
        console.warn('Error actualizando estadísticas:', error);
        setStats({
          cache: { size: 0, memoryUsage: 0, maxSize: 50 * 1024 * 1024 },
          connectivity: navigator.onLine ?? true,
          lastUpdate: Date.now()
        });
      }
    };

    // Actualizar estadísticas cada 10 segundos
    const interval = setInterval(updateStats, 10000);
    updateStats(); // Actualizar inmediatamente

    return () => clearInterval(interval);
  }, [notificacionesState]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionColor = () => {
    return stats.connectivity ? '#4CAF50' : '#F44336';
  };

  const getCacheColor = () => {
    const percentage = (stats.cache.memoryUsage / stats.cache.maxSize) * 100;
    if (percentage < 50) return '#4CAF50';
    if (percentage < 80) return '#FF9800';
    return '#F44336';
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      minWidth: '200px'
    }}>
      <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
        📊 Rendimiento
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
        <span style={{ marginRight: '8px' }}>🌐</span>
        <span style={{ color: getConnectionColor() }}>
          {stats.connectivity ? 'Online' : 'Offline'}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
        <span style={{ marginRight: '8px' }}>💾</span>
        <span style={{ color: getCacheColor() }}>
          Caché: {formatBytes(stats.cache.memoryUsage)}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
        <span style={{ marginRight: '8px' }}>📦</span>
        <span>
          Items: {stats.cache.size}
        </span>
      </div>
      
      <div style={{ 
        fontSize: '10px', 
        opacity: 0.7, 
        marginTop: '4px',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '4px'
      }}>
        Última actualización: {new Date(stats.lastUpdate).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PerformanceIndicator;
