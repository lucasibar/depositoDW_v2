import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockApi } from '../../services/stock/stockApi';

// Async thunks
export const fetchStock = createAsyncThunk(
  'stock/fetchStock',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stockApi.getAllMovimientos();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock');
    }
  }
);

const initialState = {
  stock: [],
  posiciones: [],
  stockByMaterial: [],
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
      // Fetch stock
      .addCase(fetchStock.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStock.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stock = action.payload;
      })
      .addCase(fetchStock.rejected, (state, action) => {
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