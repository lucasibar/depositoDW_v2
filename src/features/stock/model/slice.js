import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockApi } from '../api/stockApi';

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

export const fetchStockByItem = createAsyncThunk(
  'stock/fetchStockByItem',
  async (idItem, { rejectWithValue }) => {
    try {
      const response = await stockApi.getStockByItem(idItem);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock del item');
    }
  }
);

export const fetchStockTotal = createAsyncThunk(
  'stock/fetchStockTotal',
  async (idItem, { rejectWithValue }) => {
    try {
      const response = await stockApi.getStockTotal(idItem);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock total');
    }
  }
);

export const fetchStockConsolidado = createAsyncThunk(
  'stock/fetchStockConsolidado',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stockApi.getStockConsolidado();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock consolidado');
    }
  }
);

const initialState = {
  stock: [],
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
      // Fetch stock by item
      .addCase(fetchStockByItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockByItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stockByItem = action.payload;
      })
      .addCase(fetchStockByItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch stock total
      .addCase(fetchStockTotal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockTotal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stockTotal = action.payload;
      })
      .addCase(fetchStockTotal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch stock consolidado
      .addCase(fetchStockConsolidado.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockConsolidado.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stock = action.payload;
      })
      .addCase(fetchStockConsolidado.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedStock, clearError } = stockSlice.actions;
export default stockSlice.reducer; 