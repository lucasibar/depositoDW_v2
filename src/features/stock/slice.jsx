import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockApi } from '../../services/stock/stockApi';



export const fetchMovimientosConsultaRapida = createAsyncThunk(
  'stock/fetchMovimientosConsultaRapida',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stockApi.getMovimientosConsultaRapida();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Error al cargar movimientos consulta rápida'
      );
    }
  }
);

const initialState = {
  stock: [],
  isLoading: false,
  error: null,
  selectedStock: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setSelectedStock: (state, action) => {
      state.selectedStock = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      // Fetch movimientos consulta rápida
      .addCase(fetchMovimientosConsultaRapida.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovimientosConsultaRapida.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stock = action.payload;
      })
      .addCase(fetchMovimientosConsultaRapida.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
     
  },
});

export const { 
  setSelectedStock, 
  clearError
} = stockSlice.actions;
export default stockSlice.reducer; 