import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordenesCompraApi } from '../api/ordenesCompraApi';

// Async thunks
export const fetchOrdenesCompra = createAsyncThunk(
  'ordenesCompra/fetchOrdenesCompra',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordenesCompraApi.getOrdenesCompra();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar órdenes de compra');
    }
  }
);

export const createOrdenCompra = createAsyncThunk(
  'ordenesCompra/createOrdenCompra',
  async (ordenData, { rejectWithValue }) => {
    try {
      const response = await ordenesCompraApi.createOrdenCompra(ordenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear orden de compra');
    }
  }
);

export const updateOrdenCompra = createAsyncThunk(
  'ordenesCompra/updateOrdenCompra',
  async ({ id, ordenData }, { rejectWithValue }) => {
    try {
      const response = await ordenesCompraApi.updateOrdenCompra(id, ordenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar orden de compra');
    }
  }
);

const initialState = {
  ordenesCompra: [],
  isLoading: false,
  error: null,
  selectedOrden: null,
};

const ordenesCompraSlice = createSlice({
  name: 'ordenesCompra',
  initialState,
  reducers: {
    setSelectedOrden: (state, action) => {
      state.selectedOrden = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch órdenes de compra
      .addCase(fetchOrdenesCompra.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdenesCompra.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordenesCompra = action.payload;
      })
      .addCase(fetchOrdenesCompra.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create orden de compra
      .addCase(createOrdenCompra.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrdenCompra.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordenesCompra.push(action.payload);
      })
      .addCase(createOrdenCompra.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update orden de compra
      .addCase(updateOrdenCompra.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrdenCompra.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.ordenesCompra.findIndex(orden => orden.id === action.payload.id);
        if (index !== -1) {
          state.ordenesCompra[index] = action.payload;
        }
      })
      .addCase(updateOrdenCompra.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrden, clearError } = ordenesCompraSlice.actions;
export default ordenesCompraSlice.reducer; 