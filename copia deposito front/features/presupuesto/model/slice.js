import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { presupuestoApi } from '../api/presupuestoApi';

// Async thunks
export const fetchPresupuesto = createAsyncThunk(
  'presupuesto/fetchPresupuesto',
  async (_, { rejectWithValue }) => {
    try {
      const response = await presupuestoApi.getPresupuesto();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar presupuesto');
    }
  }
);

export const createPresupuesto = createAsyncThunk(
  'presupuesto/createPresupuesto',
  async (presupuestoData, { rejectWithValue }) => {
    try {
      const response = await presupuestoApi.createPresupuesto(presupuestoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear presupuesto');
    }
  }
);

export const updatePresupuesto = createAsyncThunk(
  'presupuesto/updatePresupuesto',
  async ({ id, presupuestoData }, { rejectWithValue }) => {
    try {
      const response = await presupuestoApi.updatePresupuesto(id, presupuestoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar presupuesto');
    }
  }
);

const initialState = {
  presupuesto: [],
  isLoading: false,
  error: null,
  selectedPresupuesto: null,
};

const presupuestoSlice = createSlice({
  name: 'presupuesto',
  initialState,
  reducers: {
    setSelectedPresupuesto: (state, action) => {
      state.selectedPresupuesto = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch presupuesto
      .addCase(fetchPresupuesto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPresupuesto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.presupuesto = action.payload;
      })
      .addCase(fetchPresupuesto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create presupuesto
      .addCase(createPresupuesto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPresupuesto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.presupuesto.push(action.payload);
      })
      .addCase(createPresupuesto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update presupuesto
      .addCase(updatePresupuesto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePresupuesto.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.presupuesto.findIndex(pres => pres.id === action.payload.id);
        if (index !== -1) {
          state.presupuesto[index] = action.payload;
        }
      })
      .addCase(updatePresupuesto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedPresupuesto, clearError } = presupuestoSlice.actions;
export default presupuestoSlice.reducer; 