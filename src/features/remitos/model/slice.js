import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { remitosApi } from '../api/remitosApi';

// Async thunks
export const fetchRemitos = createAsyncThunk(
  'remitos/fetchRemitos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remitosApi.getDataRemitoRecepcion();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar remitos');
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
      .addCase(fetchRemitos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRemitos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.remitos = action.payload;
      })
      .addCase(fetchRemitos.rejected, (state, action) => {
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
        state.remitos.push(action.payload);
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
        state.remitos.push(action.payload);
      })
      .addCase(createRemitoSalida.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedRemito, clearError } = remitosSlice.actions;
export default remitosSlice.reducer; 