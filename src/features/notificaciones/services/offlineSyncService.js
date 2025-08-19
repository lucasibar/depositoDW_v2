import { 
  addNotificacion, 
  addPendingOperation, 
  removePendingOperation, 
  incrementIntentos, 
  markOperationAsFailed,
  setSyncingStatus,
  setOnlineStatus,
  clearFailedOperations
} from '../model/notificacionesSlice';
import { stockApi } from '../../stock/api/stockApi';
import { v4 as uuidv4 } from 'uuid';

class OfflineSyncService {
  constructor() {
    this.store = null;
    this.syncInterval = null;
    this.isInitialized = false;
    this.operationHandlers = {
      'adicionRapida': this.handleAdicionRapida,
      'ajusteStock': this.handleAjusteStock,
      'movimientoInterno': this.handleMovimientoInterno,
      'correccionItem': this.handleCorreccionItem,
    };
  }

  // Inicializar el servicio con el store
  init(store) {
    if (this.isInitialized) return;
    
    this.store = store;
    this.setupNetworkListeners();
    this.startSyncInterval();
    this.isInitialized = true;
  }

  // Configurar listeners de red
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      if (this.store) {
        this.store.dispatch(setOnlineStatus(true));
        this.addNotificacion('info', 'Conexión restaurada. Sincronizando operaciones pendientes...');
        this.syncPendingOperations();
      }
    });

    window.addEventListener('offline', () => {
      if (this.store) {
        this.store.dispatch(setOnlineStatus(false));
        this.addNotificacion('alerta', 'Conexión perdida. Las operaciones se guardarán localmente.');
      }
    });
  }

  // Iniciar intervalo de sincronización
  startSyncInterval() {
    this.syncInterval = setInterval(() => {
      if (this.store) {
        const state = this.store.getState();
        if (state.notificaciones.isOnline && state.notificaciones.pendingOperations.length > 0) {
          this.syncPendingOperations();
        }
      }
    }, 120000); // Sincronizar cada 2 minutos para reducir consumo de datos
  }

  // Detener intervalo de sincronización
  stopSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Agregar notificación
  addNotificacion(categoria, mensaje, data = null) {
    if (!this.store) return;
    
    const id = uuidv4();
    this.store.dispatch(addNotificacion({
      id,
      categoria,
      mensaje,
      data
    }));
  }

  // Ejecutar operación con manejo offline
  async executeOperation(tipo, data, optimisticUpdate = null) {
    if (!this.store) {
      throw new Error('OfflineSyncService no está inicializado. Llama a init() primero.');
    }
    
    const state = this.store.getState();
    const isOnline = state.notificaciones.isOnline;

    // Si estamos offline, agregar a la queue
    if (!isOnline) {
      const operationId = uuidv4();
      this.store.dispatch(addPendingOperation({
        id: operationId,
        tipo,
        data,
        timestamp: Date.now()
      }));

      // Aplicar actualización optimista si se proporciona
      if (optimisticUpdate) {
        optimisticUpdate();
      }

      this.addNotificacion('info', `Operación guardada localmente. Se sincronizará cuando se restaure la conexión.`);
      return { success: true, offline: true, operationId };
    }

    // Si estamos online, intentar ejecutar inmediatamente
    try {
      const handler = this.operationHandlers[tipo];
      if (!handler) {
        throw new Error(`Tipo de operación no soportado: ${tipo}`);
      }

      const result = await handler(data);
      
      // Aplicar actualización optimista si se proporciona
      if (optimisticUpdate) {
        optimisticUpdate();
      }

      return { success: true, offline: false, result };
    } catch (error) {
      // Si falla, agregar a la queue
      const operationId = uuidv4();
      this.store.dispatch(addPendingOperation({
        id: operationId,
        tipo,
        data,
        timestamp: Date.now()
      }));

      this.addNotificacion('alerta', `Error en operación: ${error.message}. Se guardará para sincronización posterior.`, {
        error: error.message,
        operationType: tipo,
        data
      });

      // Aplicar actualización optimista si se proporciona
      if (optimisticUpdate) {
        optimisticUpdate();
      }

      return { success: false, offline: true, operationId, error: error.message };
    }
  }

  // Sincronizar operaciones pendientes
  async syncPendingOperations() {
    if (!this.store) return;
    
    const state = this.store.getState();
    const pendingOps = state.notificaciones.pendingOperations.filter(op => !op.failed);

    if (pendingOps.length === 0) return;

    this.store.dispatch(setSyncingStatus(true));

    for (const operation of pendingOps) {
      try {
        const handler = this.operationHandlers[operation.tipo];
        if (!handler) {
          throw new Error(`Tipo de operación no soportado: ${operation.tipo}`);
        }

        await handler(operation.data);
        
        // Remover operación exitosa
        this.store.dispatch(removePendingOperation({ id: operation.id }));
        
        this.addNotificacion('info', `Operación sincronizada exitosamente: ${operation.tipo}`);
      } catch (error) {
        // Incrementar intentos
        this.store.dispatch(incrementIntentos({ id: operation.id }));
        
        const updatedState = this.store.getState();
        const updatedOp = updatedState.notificaciones.pendingOperations.find(op => op.id === operation.id);
        
        if (updatedOp && updatedOp.intentos >= updatedOp.maxIntentos) {
          // Marcar como fallida permanentemente
          this.store.dispatch(markOperationAsFailed({ id: operation.id }));
          
          this.addNotificacion('error', `Operación falló permanentemente después de ${updatedOp.maxIntentos} intentos: ${operation.tipo}`, {
            error: error.message,
            operationType: operation.tipo,
            data: operation.data
          });
        } else {
          this.addNotificacion('alerta', `Error sincronizando operación: ${error.message}. Reintentando...`, {
            error: error.message,
            operationType: operation.tipo,
            data: operation.data
          });
        }
      }
    }

    this.store.dispatch(setSyncingStatus(false));
  }

  // Handlers específicos para cada tipo de operación
  async handleAdicionRapida(data) {
    const response = await stockApi.adicionRapida(data);
    return response.data;
  }

  async handleAjusteStock(data) {
    const response = await stockApi.ajusteStock(data);
    return response.data;
  }

  async handleMovimientoInterno(data) {
    const response = await stockApi.movimientoInterno(data);
    return response.data;
  }

  async handleCorreccionItem(data) {
    const response = await stockApi.correccionItem(data);
    return response.data;
  }

  // Limpiar operaciones fallidas
  clearFailedOperations() {
    if (this.store) {
      this.store.dispatch(clearFailedOperations());
    }
  }

  // Obtener estadísticas de sincronización
  getSyncStats() {
    if (!this.store) {
      return {
        isOnline: navigator.onLine,
        isSyncing: false,
        pendingCount: 0,
        failedCount: 0,
        totalCount: 0
      };
    }
    
    const state = this.store.getState();
    const { pendingOperations, isOnline, isSyncing } = state.notificaciones;
    
    return {
      isOnline,
      isSyncing,
      pendingCount: pendingOperations.filter(op => !op.failed).length,
      failedCount: pendingOperations.filter(op => op.failed).length,
      totalCount: pendingOperations.length
    };
  }
}

// Exportar instancia singleton
export const offlineSyncService = new OfflineSyncService();
