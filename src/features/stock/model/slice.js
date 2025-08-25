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
      console.log('🔍 fetchStockConsolidado thunk: response recibida:', response);
      return response; // La API ya devuelve los datos directamente
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar stock consolidado');
    }
  }
);

export const fetchPosicionesConItems = createAsyncThunk(
  'stock/fetchPosicionesConItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stockApi.getPosicionesConItems();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar posiciones');
    }
  }
);

export const adicionRapida = createAsyncThunk(
  'stock/adicionRapida',
  async (adicionData, { rejectWithValue }) => {
    try {
      const response = await stockApi.adicionRapida(adicionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error en adición rápida');
    }
  }
);

export const ajusteStock = createAsyncThunk(
  'stock/ajusteStock',
  async (ajusteData, { rejectWithValue }) => {
    try {
      const response = await stockApi.ajusteStock(ajusteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error en ajuste de stock');
    }
  }
);

export const movimientoInterno = createAsyncThunk(
  'stock/movimientoInterno',
  async (movimientoData, { rejectWithValue }) => {
    try {
      const response = await stockApi.movimientoInterno(movimientoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error en movimiento interno');
    }
  }
);

export const correccionItem = createAsyncThunk(
  'stock/correccionItem',
  async (correccionData, { rejectWithValue }) => {
    try {
      const response = await stockApi.correccionItem(correccionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error en corrección');
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
        console.log('🔄 fetchStockConsolidado: Pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockConsolidado.fulfilled, (state, action) => {
        console.log('✅ fetchStockConsolidado: Fulfilled', action.payload);
        console.log('✅ fetchStockConsolidado: Payload length:', action.payload?.length);
        state.isLoading = false;
        state.stock = action.payload;
      })
      .addCase(fetchStockConsolidado.rejected, (state, action) => {
        console.log('❌ fetchStockConsolidado: Rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch posiciones con items
      .addCase(fetchPosicionesConItems.pending, (state) => {
        console.log('Fetching posiciones con items...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosicionesConItems.fulfilled, (state, action) => {
        console.log('Posiciones con items cargadas:', action.payload?.length, 'posiciones');
        state.isLoading = false;
        state.posiciones = action.payload;
      })
      .addCase(fetchPosicionesConItems.rejected, (state, action) => {
        console.error('Error cargando posiciones:', action.payload);
        state.isLoading = false;
        state.error = action.payload;
      })
      // Adición rápida
      .addCase(adicionRapida.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adicionRapida.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(adicionRapida.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Movimiento interno
      .addCase(movimientoInterno.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(movimientoInterno.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(movimientoInterno.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Corrección item
      .addCase(correccionItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(correccionItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(correccionItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setSelectedStock, 
  clearError
} = stockSlice.actions;
export default stockSlice.reducer; 