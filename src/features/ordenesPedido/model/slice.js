import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordenesPedidoApi } from '../api/ordenesPedidoApi';

// Estado inicial
const initialState = {
  ordenes: [],
  ordenActual: null,
  ordenACopiar: null,
  loading: false,
  error: null,
  filtros: {
    fechaDesde: null,
    fechaHasta: null,
    estado: 'todos',
    proveedor: null,
    numeroOrden: ''
  },
  paginacion: {
    pagina: 1,
    limite: 10,
    total: 0,
    totalPaginas: 0
  }
};

// Async thunks
export const fetchOrdenesPedido = createAsyncThunk(
  'ordenesPedido/fetchOrdenesPedido',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await ordenesPedidoApi.getOrdenes(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener órdenes de pedido');
    }
  }
);

export const fetchOrdenPedidoById = createAsyncThunk(
  'ordenesPedido/fetchOrdenPedidoById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ordenesPedidoApi.getOrdenById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener la orden de pedido');
    }
  }
);

export const createOrdenPedido = createAsyncThunk(
  'ordenesPedido/createOrdenPedido',
  async (ordenData, { rejectWithValue }) => {
    try {
      const response = await ordenesPedidoApi.createOrden(ordenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear la orden de pedido');
    }
  }
);

export const updateOrdenPedido = createAsyncThunk(
  'ordenesPedido/updateOrdenPedido',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await ordenesPedidoApi.updateOrden(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar la orden de pedido');
    }
  }
);

export const deleteOrdenPedido = createAsyncThunk(
  'ordenesPedido/deleteOrdenPedido',
  async (id, { rejectWithValue }) => {
    try {
      await ordenesPedidoApi.deleteOrden(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar la orden de pedido');
    }
  }
);

export const fetchOrdenesPedidoAgrupadas = createAsyncThunk(
  'ordenesPedido/fetchOrdenesPedidoAgrupadas',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await ordenesPedidoApi.getOrdenesAgrupadas(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener órdenes de pedido agrupadas');
    }
  }
);

export const generarPicking = createAsyncThunk(
  'ordenesPedido/generarPicking',
  async ({ ordenId, fechaPicking }, { rejectWithValue }) => {
    try {
      const response = await ordenesPedidoApi.generarPicking(ordenId, { fechaPicking });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al generar picking');
    }
  }
);


// Slice
const ordenesPedidoSlice = createSlice({
  name: 'ordenesPedido',
  initialState,
  reducers: {
    setFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    resetFiltros: (state) => {
      state.filtros = initialState.filtros;
    },
    setPaginacion: (state, action) => {
      state.paginacion = { ...state.paginacion, ...action.payload };
    },
    setOrdenActual: (state, action) => {
      state.ordenActual = action.payload;
    },
    clearOrdenActual: (state) => {
      state.ordenActual = null;
    },
    setOrdenACopiar: (state, action) => {
      state.ordenACopiar = action.payload;
    },
    clearOrdenACopiar: (state) => {
      state.ordenACopiar = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch órdenes
      .addCase(fetchOrdenesPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenesPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenes = action.payload.ordenes || action.payload;
        state.paginacion.total = action.payload.total || action.payload.length;
        state.paginacion.totalPaginas = action.payload.totalPaginas || Math.ceil((action.payload.total || action.payload.length) / state.paginacion.limite);
      })
      .addCase(fetchOrdenesPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch órdenes agrupadas
      .addCase(fetchOrdenesPedidoAgrupadas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenesPedidoAgrupadas.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenes = action.payload;
        state.paginacion.total = action.payload.length;
        state.paginacion.totalPaginas = Math.ceil(action.payload.length / state.paginacion.limite);
      })
      .addCase(fetchOrdenesPedidoAgrupadas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch orden por ID
      .addCase(fetchOrdenPedidoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdenPedidoById.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenActual = action.payload;
      })
      .addCase(fetchOrdenPedidoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Crear orden
      .addCase(createOrdenPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrdenPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenes.unshift(action.payload);
        state.ordenActual = action.payload;
      })
      .addCase(createOrdenPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Actualizar orden
      .addCase(updateOrdenPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrdenPedido.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ordenes.findIndex(orden => orden.id === action.payload.id);
        if (index !== -1) {
          state.ordenes[index] = action.payload;
        }
        if (state.ordenActual?.id === action.payload.id) {
          state.ordenActual = action.payload;
        }
      })
      .addCase(updateOrdenPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Eliminar orden
      .addCase(deleteOrdenPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrdenPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.ordenes = state.ordenes.filter(orden => orden.id !== action.payload);
        if (state.ordenActual?.id === action.payload) {
          state.ordenActual = null;
        }
      })
      .addCase(deleteOrdenPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generar picking
      .addCase(generarPicking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generarPicking.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar la orden con el picking generado
        const index = state.ordenes.findIndex(orden => orden.id === action.payload.ordenId);
        if (index !== -1) {
          state.ordenes[index] = { ...state.ordenes[index], ...action.payload };
        }
        if (state.ordenActual?.id === action.payload.ordenId) {
          state.ordenActual = { ...state.ordenActual, ...action.payload };
        }
      })
      .addCase(generarPicking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFiltros,
  resetFiltros,
  setPaginacion,
  setOrdenActual,
  clearOrdenActual,
  setOrdenACopiar,
  clearOrdenACopiar,
  clearError
} = ordenesPedidoSlice.actions;

export default ordenesPedidoSlice.reducer;
