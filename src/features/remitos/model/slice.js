import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { remitosApi } from '../api/remitosApi';

// Async thunks
export const fetchRemitosData = createAsyncThunk(
  'remitos/fetchRemitosData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remitosApi.getDataRemitoRecepcion();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar remitos');
    }
  }
);

export const fetchRemitosEntrada = createAsyncThunk(
  'remitos/fetchRemitosEntrada',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remitosApi.getRemitosEntrada();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar remitos de entrada');
    }
  }
);

export const fetchRemitosEntradaAgrupados = createAsyncThunk(
  'remitos/fetchRemitosEntradaAgrupados',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remitosApi.getRemitosEntradaAgrupados();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar remitos de entrada agrupados');
    }
  }
);

export const deleteMovimientoRemito = createAsyncThunk(
  'remitos/deleteMovimientoRemito',
  async (movimientoId, { rejectWithValue }) => {
    try {
      const response = await remitosApi.deleteMovimientoRemito(movimientoId);
      return { movimientoId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar movimiento');
    }
  }
);

export const dataProveedoresItems = createAsyncThunk(
  'remitos/dataProveedoresItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remitosApi.getDataRemitoRecepcion();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar proveedores e items');
    }
  }
);

export const createRemitoEntrada = createAsyncThunk(
  'remitos/createRemitoEntrada',
  async (remitoData, { rejectWithValue }) => {
    try {
      const response = await remitosApi.createRemitoEntrada(remitoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear remito de entrada');
    }
  }
);

export const createRemitoSalida = createAsyncThunk(
  'remitos/createRemitoSalida',
  async (remitoData, { rejectWithValue }) => {
    try {
      const response = await remitosApi.createRemitoSalida(remitoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear remito de salida');
    }
  }
);



const initialState = {
  remitos: [],
  items: [],
  proveedores: [],
  isLoading: false,
  error: null,
  selectedRemito: null,
};

const remitosSlice = createSlice({
  name: 'remitos',
  initialState,
  reducers: {
    setSelectedRemito: (state, action) => {
      state.selectedRemito = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch remitos
      .addCase(fetchRemitosData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRemitosData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.proveedores = action.payload.proveedores || [];
      })
      .addCase(fetchRemitosData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Data proveedores items
      .addCase(dataProveedoresItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(dataProveedoresItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.proveedores = action.payload.proveedores || [];
      })
      .addCase(dataProveedoresItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create remito entrada
      .addCase(createRemitoEntrada.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRemitoEntrada.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.remitos.push(action.payload);
        }
      })
      .addCase(createRemitoEntrada.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create remito salida
      .addCase(createRemitoSalida.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRemitoSalida.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.remitos.push(action.payload);
        }
      })
      .addCase(createRemitoSalida.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch remitos entrada
      .addCase(fetchRemitosEntrada.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRemitosEntrada.fulfilled, (state, action) => {
        state.isLoading = false;
        state.remitos = action.payload;
      })
      .addCase(fetchRemitosEntrada.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch remitos entrada agrupados
      .addCase(fetchRemitosEntradaAgrupados.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRemitosEntradaAgrupados.fulfilled, (state, action) => {
        state.isLoading = false;
        state.remitos = action.payload;
      })
      .addCase(fetchRemitosEntradaAgrupados.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete movimiento remito
      .addCase(deleteMovimientoRemito.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMovimientoRemito.fulfilled, (state, action) => {
        state.isLoading = false;
        // Recargar los remitos después de eliminar
        // El componente se encargará de recargar los datos
      })
      .addCase(deleteMovimientoRemito.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedRemito, clearError } = remitosSlice.actions;
export default remitosSlice.reducer; 