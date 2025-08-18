import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificacionesApi } from '../api/notificacionesApi';

// Async thunks
export const fetchNotificaciones = createAsyncThunk(
  'notificaciones/fetchNotificaciones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificacionesApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar notificaciones');
    }
  }
);

export const fetchNotificacionesUnread = createAsyncThunk(
  'notificaciones/fetchNotificacionesUnread',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificacionesApi.getUnread();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar notificaciones no leídas');
    }
  }
);

export const fetchNotificacionesStats = createAsyncThunk(
  'notificaciones/fetchNotificacionesStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificacionesApi.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas');
    }
  }
);

export const markNotificacionAsRead = createAsyncThunk(
  'notificaciones/markNotificacionAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await notificacionesApi.markAsRead(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al marcar como leída');
    }
  }
);

export const markAllNotificacionesAsRead = createAsyncThunk(
  'notificaciones/markAllNotificacionesAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificacionesApi.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al marcar todas como leídas');
    }
  }
);

export const deleteNotificacion = createAsyncThunk(
  'notificaciones/deleteNotificacion',
  async (id, { rejectWithValue }) => {
    try {
      await notificacionesApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar notificación');
    }
  }
);

export const deleteAllNotificaciones = createAsyncThunk(
  'notificaciones/deleteAllNotificaciones',
  async (_, { rejectWithValue }) => {
    try {
      await notificacionesApi.deleteAll();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar todas las notificaciones');
    }
  }
);

export const deleteReadNotificaciones = createAsyncThunk(
  'notificaciones/deleteReadNotificaciones',
  async (_, { rejectWithValue }) => {
    try {
      await notificacionesApi.deleteRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar notificaciones leídas');
    }
  }
);

const initialState = {
  notificaciones: [],
  stats: {
    total: 0,
    unread: 0,
    alertas: 0,
    errores: 0
  },
  isOnline: navigator.onLine,
  pendingOperations: [],
  isSyncing: false,
  isLoading: false,
  error: null,
};

const notificacionesSlice = createSlice({
  name: 'notificaciones',
  initialState,
  reducers: {
    // Agregar notificación
    addNotificacion: (state, action) => {
      const { id, categoria, mensaje, timestamp = Date.now(), data = null } = action.payload;
      state.notificaciones.unshift({
        id,
        categoria,
        mensaje,
        timestamp,
        data,
        leida: false
      });
      
      // Mantener solo las últimas 100 notificaciones
      if (state.notificaciones.length > 100) {
        state.notificaciones = state.notificaciones.slice(0, 100);
      }
    },

    // Marcar notificación como leída
    marcarComoLeida: (state, action) => {
      const { id } = action.payload;
      const notificacion = state.notificaciones.find(n => n.id === id);
      if (notificacion) {
        notificacion.leida = true;
      }
    },

    // Limpiar notificaciones leídas
    limpiarNotificacionesLeidas: (state) => {
      state.notificaciones = state.notificaciones.filter(n => !n.leida);
    },

    // Limpiar todas las notificaciones
    limpiarTodasNotificaciones: (state) => {
      state.notificaciones = [];
    },

    // Actualizar estado de conexión
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },

    // Agregar operación pendiente
    addPendingOperation: (state, action) => {
      const { id, tipo, data, timestamp = Date.now() } = action.payload;
      state.pendingOperations.push({
        id,
        tipo,
        data,
        timestamp,
        intentos: 0,
        maxIntentos: 3
      });
    },

    // Remover operación pendiente (cuando se ejecuta exitosamente)
    removePendingOperation: (state, action) => {
      const { id } = action.payload;
      state.pendingOperations = state.pendingOperations.filter(op => op.id !== id);
    },

    // Incrementar intentos de una operación
    incrementIntentos: (state, action) => {
      const { id } = action.payload;
      const operation = state.pendingOperations.find(op => op.id === id);
      if (operation) {
        operation.intentos += 1;
      }
    },

    // Marcar operación como fallida permanentemente
    markOperationAsFailed: (state, action) => {
      const { id } = action.payload;
      const operation = state.pendingOperations.find(op => op.id === id);
      if (operation) {
        operation.failed = true;
      }
    },

    // Actualizar estado de sincronización
    setSyncingStatus: (state, action) => {
      state.isSyncing = action.payload;
    },

    // Limpiar operaciones fallidas
    clearFailedOperations: (state) => {
      state.pendingOperations = state.pendingOperations.filter(op => !op.failed);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notificaciones
      .addCase(fetchNotificaciones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificaciones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notificaciones = action.payload;
      })
      .addCase(fetchNotificaciones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch notificaciones unread
      .addCase(fetchNotificacionesUnread.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificacionesUnread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notificaciones = action.payload;
      })
      .addCase(fetchNotificacionesUnread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchNotificacionesStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificacionesStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchNotificacionesStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markNotificacionAsRead.fulfilled, (state, action) => {
        const notificacion = state.notificaciones.find(n => n.id === action.payload.id);
        if (notificacion) {
          notificacion.leida = true;
        }
      })
      // Mark all as read
      .addCase(markAllNotificacionesAsRead.fulfilled, (state) => {
        state.notificaciones.forEach(n => n.leida = true);
      })
      // Delete notificación
      .addCase(deleteNotificacion.fulfilled, (state, action) => {
        state.notificaciones = state.notificaciones.filter(n => n.id !== action.payload);
      })
      // Delete all notificaciones
      .addCase(deleteAllNotificaciones.fulfilled, (state) => {
        state.notificaciones = [];
      })
      // Delete read notificaciones
      .addCase(deleteReadNotificaciones.fulfilled, (state) => {
        state.notificaciones = state.notificaciones.filter(n => !n.leida);
      });
  },
});

export const {
  addNotificacion,
  marcarComoLeida,
  limpiarNotificacionesLeidas,
  limpiarTodasNotificaciones,
  setOnlineStatus,
  addPendingOperation,
  removePendingOperation,
  incrementIntentos,
  markOperationAsFailed,
  setSyncingStatus,
  clearFailedOperations
} = notificacionesSlice.actions;

export default notificacionesSlice.reducer;
